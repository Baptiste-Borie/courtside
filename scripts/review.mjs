import { chromium } from 'playwright'
import { createServer } from 'vite'
import { zipSync, strToU8 } from 'fflate'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('..', import.meta.url))
const output = new URL('../review/', import.meta.url)
const require = createRequire(import.meta.url)
const report = { status: 'running', checks: [], errors: [], captures: [] }
let server, browser
async function installBrowser() {
  console.log('Installation automatique de Chromium pour la première revue…')
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(dirname(require.resolve('playwright')), 'cli.js'), 'install', 'chromium'], { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Installation de Chromium échouée (${code}). Vérifiez votre connexion puis relancez npm run review.`)))
  })
}
async function capture(page, filename) {
  await page.screenshot({ path: fileURLToPath(new URL(filename, output)), fullPage: true, animations: 'disabled' })
  report.captures.push(filename)
}
await mkdir(output, { recursive: true })
try {
  try { browser = await chromium.launch({ headless: true }) }
  catch (error) {
    if (!error.message.includes("Executable doesn't exist")) throw error
    await installBrowser()
    browser = await chromium.launch({ headless: true })
  }
  server = await createServer({ root, server: { host: '127.0.0.1', port: 0, open: false } })
  await server.listen()
  const address = server.httpServer.address()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  page.on('pageerror', error => report.errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()) })
  await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Votre équipe', exact: true }).waitFor()
  await capture(page, '01-roster.png')
  await page.getByRole('button', { name: 'Inscrire mon équipe' }).click()
  await page.getByRole('button', { name: 'Avancer au prochain événement', exact: true }).click()
  await page.getByRole('button', { name: 'Jouer le prochain match' }).click()
  await capture(page, '02-tournament.png')
  await page.getByRole('button', { name: 'Avancer au prochain événement', exact: true }).click()
  await page.getByRole('button', { name: 'Jouer le prochain match' }).click()
  await page.getByRole('button', { name: 'Avancer au prochain événement', exact: true }).click()
  await page.getByRole('button', { name: 'Jouer le prochain match' }).click()
  await page.getByRole('button', { name: 'Participer au prochain tournoi' }).waitFor()
  await capture(page, '03-reward.png')
  await page.getByRole('button', { name: 'Mon équipe', exact: true }).click()
  await capture(page, '11-fatigue.png')
  const tiredRoster=await page.evaluate(()=>JSON.parse(localStorage.getItem('courtside.save.v1')).roster)
  if(!tiredRoster.some(p=>p.fatigue>0) || !tiredRoster.some(p=>p.fatigue===0)) throw Error('Fatigue des titulaires ou repos du banc incorrect')
  await page.getByRole('button', { name: 'Tournoi', exact: true }).click()
  report.checks.push('Fatigue des titulaires et repos du banc')
  report.checks.push('Inscription, trois matchs et récompense de tournoi')
  await page.getByRole('button', { name: 'Participer au prochain tournoi' }).click()
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Avancer au prochain événement', exact: true }).click()
    await page.getByRole('button', { name: 'Jouer le prochain match' }).click()
  }
  await page.getByRole('button', { name: 'Scouting', exact: true }).click()
  await page.getByRole('button', { name: 'Lancer un scouting · 50 F', exact: true }).click()
  await capture(page, '10-scouting-pending.png')
  const fatigueBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('courtside.save.v1')).roster.reduce((sum,p)=>sum+p.fatigue,0))
  if (await page.getByRole('button', { name: 'Révéler le prochain dossier' }).count()) throw Error('Scouting disponible avant son retour')
  await page.getByRole('button', { name: 'Avancer au prochain événement', exact: true }).click()
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Révéler le prochain dossier' }).click()
  const fatigueAfter=await page.evaluate(()=>JSON.parse(localStorage.getItem('courtside.save.v1')).roster.reduce((sum,p)=>sum+p.fatigue,0))
  if(fatigueAfter>=fatigueBefore) throw Error('Récupération absente pendant le scouting')
  report.checks.push('Calendrier, retour du scouting et récupération')
  await capture(page, '06-scouting.png')
  await page.getByRole('button', { name: 'Terminer la campagne', exact: true }).click()
  const hire = page.getByRole('button', { name: /^Recruter/ })
  const buttons = await hire.all()
  let recruited = false
  for (const button of buttons) {
    if (await button.isEnabled()) { await button.click(); recruited = true; break }
  }
  if (!recruited) throw Error('Aucun recrutement accessible après deux tournois')
  await page.getByRole('button', { name: 'Dans votre équipe', exact: true }).waitFor()
  await capture(page, '07-recruitment.png')
  await page.getByRole('button', { name: 'Mon équipe', exact: true }).click()
  if (await page.locator('.selection').count() !== 7) throw Error('Le joueur recruté est absent de l’effectif')
  await capture(page, '08-updated-roster.png')
  await page.getByRole('button', { name: 'Scouting', exact: true }).click()
  const saved = await page.evaluate(()=>localStorage.getItem('courtside.save.v1'))
  if (!saved) throw Error('Sauvegarde automatique absente')
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByText('Partie reprise', { exact: true }).waitFor()
  if (await page.locator('.selection').count() !== 7) throw Error('Effectif perdu après rechargement')
  if (await page.evaluate(()=>localStorage.getItem('courtside.save.v1')) !== saved) throw Error('Sauvegarde modifiée à la reprise')
  await capture(page, '09-restored.png')
  await page.getByRole('button', { name: 'Tournoi', exact: true }).click()
  await page.getByRole('button', { name: 'Participer au prochain tournoi' }).waitFor()
  await page.getByRole('button', { name: 'Scouting', exact: true }).click()
  await page.getByRole('button', { name: 'Dans votre équipe', exact: true }).waitFor()
  report.checks.push('Rechargement conservant effectif, tournoi, solde et dossiers')
  report.checks.push('Scouting, recrutement et navigation conservant l’effectif')
  await page.setViewportSize({ width: 390, height: 844 })
  await capture(page, '04-mobile.png')
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Débordement mobile')
  report.checks.push('Affichage mobile sans débordement')
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.getByRole('button', { name: 'Laboratoire', exact: true }).click()
  await page.getByRole('button', { name: 'Simuler le match', exact: true }).click()
  await page.locator('.result').waitFor()
  await capture(page, '05-laboratory.png')
  const score = await page.locator('.result strong').textContent()
  await page.getByRole('button', { name: 'Simuler le match', exact: true }).click()
  if (await page.locator('.result strong').textContent() !== score) throw Error('Résultat non reproductible')
  await page.getByRole('button', { name: 'Générer les équipes' }).click()
  if (await page.locator('.result').count()) throw Error('Ancien résultat conservé après régénération')
  report.checks.push('Laboratoire : match, seed et régénération')
  if (report.errors.length) throw Error('Erreurs JavaScript détectées')
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'
  report.errors.push(error.message)
  process.exitCode = 1
} finally {
  await browser?.close()
  await server?.close()
  const json = JSON.stringify(report, null, 2)
  await writeFile(new URL('report.json', output), json)
  const archive = { 'report.json': strToU8(json) }
  for (const name of report.captures) archive[name] = new Uint8Array(await readFile(new URL(name, output)))
  await writeFile(new URL('courtside-revue-007.zip', output), zipSync(archive))
  console.log(`Revue ${report.status} : ${report.captures.length} captures. ZIP : review/courtside-revue-007.zip`)
  for (const error of report.errors) console.error(error)
}
