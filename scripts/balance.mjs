import ts from 'typescript'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
const folder = await mkdtemp(join(tmpdir(), 'courtside-balance-'))
try {
  await writeFile(join(folder, 'package.json'), '{"type":"module"}')
  for (const name of ['model', 'random', 'profiles', 'potential', 'generate', 'fitness', 'simulate']) {
    const source = await readFile(new URL(`../src/game/${name}.ts`, import.meta.url), 'utf8')
    const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext } }).outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.js'")
    await writeFile(join(folder, `${name}.js`), output)
  }
  const { generateTeam } = await import(pathToFileURL(join(folder, 'generate.js')))
  const { simulate } = await import(pathToFileURL(join(folder, 'simulate.js')))
  const results=[]
  for (const profile of ['fast', 'inside']) {
    const a=generateTeam(121,'a','Spécialistes'), b=generateTeam(122,'b','Adversaires')
    for (const p of a.players) for (const [key,value] of Object.entries(profile==='fast' ? {speed:90,acceleration:90,stamina:85,passing:80,courtVision:80,layup:80} : {insideScoring:90,postMoves:90,strength:90,layup:85,rebounding:85})) p.attributes[key]=value
    for (const tactic of ['balanced','fast','inside']) {
      let wins=0, margin=0, possessions=0
      for(let seed=0;seed<3000;seed++) { const r=simulate(a,b,tactic,'balanced',seed); wins+=Number(r.winner==='a'); margin+=r.scores[0]-r.scores[1]; possessions+=r.possessions }
      results.push({profile,tactic,matches:3000,winRate: +(wins/30).toFixed(2),meanMargin:+(margin/3000).toFixed(2),meanSequences:+(possessions/3000).toFixed(2)})
    }
  }
  console.table(results)
  console.log('18 000 matchs, seeds 0–2999, adversaire fixe. Comparaison exploratoire : ces profils synthétiques ne valident pas tout l’équilibrage.')
} finally { await rm(folder,{recursive:true,force:true}) }
