import { unzlibSync } from 'fflate'

// Vérifie les pixels, et non seulement l’existence du fichier de capture.
export function hasVisibleDetail(input) {
  const png=Buffer.from(input)
  if(png.subarray(1,4).toString()!=='PNG')throw Error('Capture PNG attendue')
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20),type=png[25]
  if(png[24]!==8||![2,6].includes(type)||png[28]!==0)throw Error('Format PNG de capture non pris en charge')
  const channels=type===6?4:3,stride=width*channels,parts=[]
  for(let offset=8;offset<png.length;) {
    const length=png.readUInt32BE(offset),name=png.toString('ascii',offset+4,offset+8)
    if(name==='IDAT')parts.push(png.subarray(offset+8,offset+8+length))
    offset+=length+12
  }
  const raw=unzlibSync(Buffer.concat(parts));let cursor=0,min=[255,255,255],max=[0,0,0],previous=new Uint8Array(stride)
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c}
  for(let y=0;y<height;y++) {
    const filter=raw[cursor++],row=new Uint8Array(stride)
    if(filter>4)throw Error('Filtre PNG invalide')
    for(let x=0;x<stride;x++) {
      const left=x>=channels?row[x-channels]:0,above=previous[x],corner=x>=channels?previous[x-channels]:0
      const prediction=filter===0?0:filter===1?left:filter===2?above:filter===3?Math.floor((left+above)/2):paeth(left,above,corner)
      row[x]=(raw[cursor++]+prediction)&255
      const channel=x%channels
      if(channel<3){min[channel]=Math.min(min[channel],row[x]);max[channel]=Math.max(max[channel],row[x])}
    }
    previous=row
  }
  return max.some((value,channel)=>value-min[channel]>20)
}
