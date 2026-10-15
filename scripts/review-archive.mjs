import { readFile, writeFile, readdir, rename, rm, unlink } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { zipSync, unzipSync, strToU8 } from 'fflate'

export async function archiveReview(output, archiveName, report) {
 const directory=output instanceof URL?fileURLToPath(output):output
 const archive={'report.json':strToU8(JSON.stringify(report,null,2))}
 for(const name of report.captures)archive[name]=await readFile(join(directory,name))
 const target=join(directory,archiveName),temporary=`${target}.tmp`
 try {
  await writeFile(temporary,zipSync(archive))
  const verified=unzipSync(await readFile(temporary))
  for(const [name,bytes] of Object.entries(archive)) {
   if(!verified[name]||!Buffer.from(verified[name]).equals(Buffer.from(bytes)))throw Error(`Archive incomplète : ${name}`)
  }
  await rename(temporary,target)
 } catch(error) {await rm(temporary,{force:true});throw error}
 // Uniquement les noms produits par les revues, y compris les anciennes
 // captures devenues inutiles. Les autres images et les ZIP sont conservés.
 let removed=0
 for(const entry of await readdir(directory,{withFileTypes:true})) {
  if(entry.isFile()&&/^(?:\d{2,}-.*|failure)\.png$/.test(entry.name)) {
   await unlink(join(directory,entry.name));removed++
  }
 }
 return removed
}
