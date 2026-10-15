import { hasVisibleDetail } from './png-check.mjs'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { zipSync, strToU8 } from 'fflate'
import { mkdir,readFile,writeFile } from 'node:fs/promises'
import { dirname,join } from 'node:path'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('..',import.meta.url)),output=new URL('../review/',import.meta.url),require=createRequire(import.meta.url)
const report={status:'running',checks:[],errors:[],captures:[],viewports:[],playtest:null}
let server,browser,page,sequence=0
const sizes=[{width:1440,height:900},{width:1366,height:768},{width:390,height:844},{width:360,height:640},{width:320,height:568},{width:844,height:390}]
const button=name=>page.getByRole('button',{name,exact:true})
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('courtside.save.v1')))
async function fit(){
 const result=await page.evaluate(()=>{
  const modal=document.querySelector('dialog[open]'),scope=modal??document
  const outside=[...scope.querySelectorAll('button,input,select,.player-card,.lineup-token,.founding-confirm')].filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&b.height>0&&(b.left<-.75||b.top<-.75||b.right>innerWidth+.75||b.bottom>innerHeight+.75)}).map(el=>`${el.tagName}.${el.className}: ${el.textContent.trim().slice(0,35)}`)
  const covered=[...scope.querySelectorAll('button,input,select')].filter(el=>{const b=el.getBoundingClientRect();if(b.width<=0||b.height<=0)return false;const hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return hit&&!el.contains(hit)&&!hit.contains(el)}).map(el=>el.textContent.trim().slice(0,35)||el.getAttribute('aria-label')||el.tagName)
  const outsideCourt=[...scope.querySelectorAll('.lineup-slot')].filter(el=>{const b=el.getBoundingClientRect(),court=el.closest('.lineup-court').getBoundingClientRect();return b.left<court.left-1||b.top<court.top-1||b.right>court.right+1||b.bottom>court.bottom+1}).map(el=>el.dataset.slot)
  const containers=modal?[modal,...modal.querySelectorAll('.game-dialog-content,.dossier-content')]:[...document.querySelectorAll('.game-stage,.screen-panel,.flow-main,.booster-section')]
  const clipped=containers.filter(el=>el.getClientRects().length&&el.scrollHeight>el.clientHeight+3).map(el=>`${el.className} (${el.scrollHeight}/${el.clientHeight})`)
  return {outside,clipped,covered,outsideCourt,scroll:document.documentElement.scrollHeight,height:innerHeight}
 })
 if(result.outside.length||result.clipped.length||result.covered.length||result.outsideCourt.length||result.scroll>result.height+1)throw Error(`Écran hors cadre : ${JSON.stringify(result)}`)
}
async function capture(label){
 const filename=`${String(++sequence).padStart(2,'0')}-${label}.png`
 const pixels=await page.screenshot({path:fileURLToPath(new URL(filename,output)),fullPage:false,animations:'disabled'})
 report.captures.push(filename)
 if(sequence%24===0)console.log(`Revue : ${sequence} captures · ${label}`)
 if(!hasVisibleDetail(pixels))throw Error(`Capture vide : ${filename}`)
 await fit()
}
async function allSizes(label){
 for(const size of sizes){await page.setViewportSize(size);await capture(`${label}-${size.width}x${size.height}`);report.viewports.push(`${label} ${size.width}x${size.height}`)}
 await page.setViewportSize(sizes[0])
}
async function resume(){await button('Continuer').click();await page.getByRole('heading',{name:'Le club',exact:true}).waitFor()}
async function playTournament(){
 if(await button('Inscrire mon équipe').count())await button('Inscrire mon équipe').click();else await button('Participer au prochain tournoi').click()
 for(let round=0;round<3;round++){await button('Avancer au prochain événement').click();await button('Jouer le prochain match').click()}
}
await mkdir(output,{recursive:true})
try {
 const launch=process.env.COURTSIDE_REVIEW_CHROMIUM?{executablePath:process.env.COURTSIDE_REVIEW_CHROMIUM,args:JSON.parse(process.env.COURTSIDE_REVIEW_ARGS??'[]'),headless:true}: {headless:true}
 try {browser=await chromium.launch(launch)}catch(error){
  if(process.env.COURTSIDE_REVIEW_CHROMIUM||!error.message.includes("Executable doesn't exist"))throw error
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[join(dirname(require.resolve('playwright')),'cli.js'),'install','chromium'],{stdio:'inherit'});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error('Installation de Chromium impossible.')))})
  browser=await chromium.launch(launch)
 }
 server=await createServer({root,server:{host:'127.0.0.1',port:0,open:false}});await server.listen()
 const address=server.httpServer.address(),context=await browser.newContext({viewport:sizes[0]})
 page=await context.newPage();page.setDefaultTimeout(12000)
 page.on('pageerror',error=>report.errors.push(error.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())})
 await page.goto(`http://127.0.0.1:${address.port}`,{waitUntil:'networkidle'})
 await allSizes('menu')
 await button('Paramètres').click();await capture('settings');await button('Fermer').click()
 await button('Nouvelle carrière').click();await allSizes('intro')
 await button('C’est parti ↗').click();await page.getByRole('textbox',{name:'Nom de ton équipe',exact:true}).fill('Les Aurores');await allSizes('identity')
 await button('Rencontrer les joueurs ↗').click();await allSizes('packs')
 await button('Ouvrir la pochette 1').click();await button('Dévoiler la carte 1 de la pochette 1').click();await allSizes('first-card')
 if(await page.locator('.flip-card.is-revealed .flip-back').count())throw Error('Le dos subsiste après révélation')
 await page.locator('.flip-front .player-details-button').first().click()
 for(const label of ['Adresse','Finition','Création','Défense','Physique et rebond']){await page.getByRole('tab',{name:label,exact:true}).click();await allSizes(`dossier-${label==='Physique et rebond'?'physique':label.toLowerCase()}`)}
 if(await page.locator('.player-dossier[open] .attribute-row').count()!==21)throw Error('Notes manquantes dans la fiche')
 await button('Fermer la fiche').click()
 const partial=await state();await page.reload({waitUntil:'networkidle'});await button('Continuer').click()
 if(JSON.stringify((await state()).founding)!==JSON.stringify(partial.founding))throw Error('Ouverture partielle perdue')
 await button('Tout dévoiler').click();await allSizes('revealed')
 await button('Composer mon effectif ↗').click();await allSizes('draft')
 const first=page.locator('.draft-grid .player-card');for(let index=0;index<4;index++)await first.nth(index).getByRole('button',{name:'Choisir ce joueur',exact:true}).click()
 await button('Page suivante').click();for(let index=0;index<2;index++)await first.nth(index).getByRole('button',{name:'Choisir ce joueur',exact:true}).click()
 await button('Entrer dans le circuit ↗').click();await allSizes('club')
 report.checks.push('Menu, création par étapes, pochettes, révélation et sélection dans la fenêtre à six résolutions')
 report.checks.push('Fiches paginées : les 21 notes restent accessibles sans défilement')
 await button('Mon équipe').click();await allSizes('team')
 const composition=(await state()).lineup,benchId=await page.locator('.lineup-bench .lineup-token').first().getAttribute('data-player-id')
 const slot=position=>page.locator(`.lineup-slot[data-slot="${position}"]`),token=id=>page.locator(`.lineup-token[data-player-id="${id}"]`)
 await token(benchId).dragTo(slot('G'));await page.waitForFunction(id=>JSON.parse(localStorage.getItem('courtside.save.v1')).lineup[0]===id,benchId)
 await slot('G').locator('.lineup-token').dragTo(slot('W'));await page.waitForFunction(id=>JSON.parse(localStorage.getItem('courtside.save.v1')).lineup[1]===id,benchId)
 await slot('G').locator('.lineup-select').press('Enter');await slot('W').locator('.lineup-select').press('Enter')
 await token(composition[0]).locator('.lineup-select').click();await slot('G').locator('.lineup-select').click()
 await slot('C').locator('.lineup-slot-title button').click()
 if(await button('Inscrire mon équipe').isEnabled())throw Error('Inscription possible avec un poste vide')
 await token(composition[2]).locator('.lineup-select').click();await slot('C').getByRole('button',{name:'Placer au poste Intérieur',exact:true}).click()
 await page.waitForFunction(ids=>JSON.stringify(JSON.parse(localStorage.getItem('courtside.save.v1')).lineup)===JSON.stringify(ids),composition)
 await button('Tactique · Équilibrée ⚙').click();await allSizes('preparation');await page.getByRole('combobox',{name:'Tactique',exact:true}).selectOption('inside');await button('Fermer Préparer le match').click()
 report.checks.push('Composition : échanges par glisser-déposer, clavier, poste vide bloquant et tactique en modale')
 await button('Inscrire mon équipe').click();await allSizes('preview')
 await button('Lire les profils').click();await allSizes('profile-help');await button('Fermer Lire les profils').click();
 await button('Voir les trois adversaires').click();await allSizes('opponents');await button('Adversaires : suivant').click();await capture('opponent-next');await button('Fermer Les adversaires').click()
 for(let round=0;round<3;round++){await button('Avancer au prochain événement').click();await button('Jouer le prochain match').click();if(round===0){await allSizes('match');await button('Bilan détaillé du match ↗').click();await allSizes('report');await button('Jeu collectif').click();await allSizes('report-collective');await button('Fermer Bilan du dernier match').click()}}
 await button('Classement').click();await allSizes('standings');await button('Tous les résultats ↗').click();await allSizes('all-results');await button('Fermer Résultats du tournoi').click()
 if((await state()).career.history.length!==1)throw Error('Récompense non enregistrée')
 await button('Mon équipe').click()
 for(let attempt=0;(await state()).money<350&&attempt<5;attempt++)await playTournament()
 report.checks.push('Tournois joués, comparaison adverse, bilan et classement sur vues séparées')
 await button('Scouting').click();await allSizes('scout-empty');await button('Lancer un scouting · 50 F').click();await allSizes('scout-pending');await button('Avancer au prochain événement').click()
 for(let i=0;i<3;i++)await button('Révéler le prochain dossier').click()
 await allSizes('scout-revealed');await button('Terminer la campagne').click();await allSizes('scout-dossiers')
 let hired=false;for(let attempt=0;attempt<3;attempt++) {const hire=page.getByRole('button',{name:/^Recruter ·/});if(await hire.isEnabled()){await hire.click();hired=true;break}await button('Dossiers : suivant').click()}
 if(!hired)throw Error('Aucun recrutement accessible')
 if((await state()).roster.length!==7)throw Error('Recrue absente')
 await button('Mon équipe').click();await allSizes('recruited-team')
 report.checks.push('Scouting avec délai, dossiers paginés et recrutement conservé')
 // Financer le camp par les résultats, sans injecter d’argent.
 for(let attempt=0;(await state()).money<100&&attempt<3;attempt++)await playTournament()
 await button('Entraînement').click();await allSizes('training');await button('Comment ça marche ?').click();await allSizes('training-help');await button('Fermer Le camp individuel').click();await button('Financer le camp · 100 F').click();await allSizes('training-pending')
 const before=await state();await page.reload({waitUntil:'networkidle'});await resume()
 if(JSON.stringify((await state()).lineup)!==JSON.stringify(before.lineup)||(await state()).money!==before.money||!(await state()).training)throw Error('Sauvegarde du camp ou des postes perdue')
 await button('Entraînement').click();await button('Avancer au prochain événement').click()
 const after=await state();if(after.training!==null||after.roster[0].attributes.threePoint!==before.roster[0].attributes.threePoint+1)throw Error('Progression du camp absente')
 await capture('training-result')
 report.checks.push('Camp, fatigue, récupération et reprise sans modifier argent, effectif ou postes')
 await button('Circuit').click();await allSizes('circuit');await button('Compétitions : suivant').click();await capture('city-lock')
 if((await state()).career.reputation<12&&await button('Choisir cette compétition').isEnabled())throw Error('Ville accessible trop tôt')
 await button('Mon équipe').click();for(let attempt=0;(await state()).career.reputation<12&&attempt<12;attempt++)await playTournament()
 if((await state()).career.reputation<12)throw Error('Ville non débloquée')
 await button('Circuit').click();await button('Palmarès · '+(await state()).career.history.length).click();await allSizes('history');await button('Compétitions').click();await button('Compétitions : suivant').click();await button('Choisir cette compétition').click();await button('Participer au prochain tournoi').click()
 for(let round=0;round<3;round++){await button('Avancer au prochain événement').click();await button('Jouer le prochain match').click()}
 const finished=await state(),last=finished.career.history.at(-1);report.playtest={tournaments:finished.edition,reputation:finished.career.reputation,roster:finished.roster.length,day:finished.calendar.day,lastCircuit:last.circuit};if(last.circuit!=='city'||last.reward!==finished.tournament.reward*2)throw Error('Récompense de ville invalide')
 report.checks.push('Déblocage par réputation, palmarès paginé et tournoi de ville avec dotation doublée')
 await button('Laboratoire').click();await allSizes('lab');await button('Simuler le match').click();await allSizes('lab-result');await button('Statistiques ↗').click();await allSizes('lab-stats');await button('Fermer Statistiques du laboratoire').click();const resultText=await page.locator('.lab-result').innerText();await button('Simuler le match').click();if(await page.locator('.lab-result').innerText()!==resultText)throw Error('Seed non reproductible');await button('Générer les équipes').click();if(await page.locator('.lab-result').count())throw Error('Ancien résultat de laboratoire conservé')
 report.checks.push('Laboratoire cadré, simulation reproductible et régénération')
 const old=await state();delete old.lineup;delete old.founding
 await page.evaluate(value=>localStorage.setItem('courtside.save.v1',JSON.stringify(value)),old)
 await page.reload({waitUntil:'networkidle'});await resume();await button('Mon équipe').click()
 if(await page.locator('.lineup-slot .lineup-token').count()!==3)throw Error('Titulaires anciens perdus')
 report.checks.push('Ancienne sauvegarde reprise avec ses joueurs et son potentiel existant')
 await page.mouse.wheel(0,2000);if(await page.evaluate(()=>scrollY)!==0)throw Error('La page peut défiler')
 report.checks.push('Aucun défilement de page et aucun contrôle masqué aux six tailles testées')
 if(report.errors.length)throw Error('Erreurs navigateur détectées')
 report.status='passed'
} catch(error){report.status='failed';report.errors.push(error.message);console.error(error.message);if(page)try{await page.screenshot({path:fileURLToPath(new URL('failure.png',output)),animations:'disabled'});report.captures.push('failure.png')}catch{}}
finally {
 if(browser)await browser.close();if(server)await server.close()
 await writeFile(new URL('report.json',output),JSON.stringify(report,null,2))
 const archive={'report.json':strToU8(JSON.stringify(report,null,2))};for(const name of report.captures)archive[name]=await readFile(new URL(name,output))
 await writeFile(new URL('courtside-revue-018.zip',output),zipSync(archive))
 console.log(`Revue ${report.status} : ${report.captures.length} captures. ZIP : review/courtside-revue-018.zip`)
 if(report.status!=='passed')process.exitCode=1
}
