import { attributeLabels, type Attributes, type Attribute, type Position, type Team } from './model'
import { pickWeighted, random } from './random'
import { playProfiles, profileOffset, profilePositionWeight } from './profiles'
const firstNames = ['Alain', 'Karim', 'Luc', 'Patrick', 'Éric', 'Marc', 'Jean', 'Malik', 'Pascal', 'David', 'Thierry', 'Nicolas']
const lastNames = ['Martin', 'Diallo', 'Bernard', 'Moreau', 'Petit', 'Leroy', 'Laurent', 'Roux', 'Benali', 'Simon', 'Dubois', 'Durand']
const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value))
export function generateTeam(seed:number,id:string,name:string):Team {
  const rng=random(seed)
  const integer=(min:number,max:number)=>min+Math.floor(rng()*(max-min+1))
  return {id,name,players:Array.from({length:3},(_,i)=>{
    const position:Position=(['G','W','C'] as const)[i]!
    const profile=playProfiles[pickWeighted(rng,playProfiles.map(profile=>profilePositionWeight(profile,position)))]!
    // Quelques gabarits atypiques, sans supprimer les tendances majoritaires.
    const unusual=rng()<.035
    const slot: [number,number]=position==='G'?[170,194]:position==='W'?[180,207]:[190,214]
    const height=unusual?integer(170,214):integer(Math.max(slot[0],profile.height[0]),Math.min(slot[1],profile.height[1]))
    const weight=clamp(Math.round(height-110+profile.build+integer(-5,5)),55,130)
    const base=integer(34,49)
    const attributes=Object.fromEntries((Object.keys(attributeLabels) as Attribute[]).map(key=>[key,base+profileOffset(profile,key)+integer(-8,8)])) as Attributes
    const reach=(height-190)*.65
    attributes.blocks+=Math.round(reach)
    attributes.interiorDefense+=Math.round(reach*.7)
    attributes.rebounding+=Math.round(reach*.8)
    attributes.strength+=Math.round((weight-80)*.55)
    attributes.speed-=Math.round((weight-80)*.25)
    attributes.acceleration-=Math.round((weight-80)*.2)
    for(const key of Object.keys(attributes) as Attribute[])attributes[key]=clamp(attributes[key],0,99)
    const signature=profile.strengths[0]!
    attributes[signature]=Math.max(73,attributes[signature])
    const overall=Math.round(Object.values(attributes).reduce((a,b)=>a+b,0)/Object.keys(attributes).length)
    return {id:`${id}-${i}`,firstName:firstNames[integer(0,firstNames.length-1)]!,lastName:lastNames[integer(0,lastNames.length-1)]!,birthYear:1983-integer(18,34),height,weight,position,secondaryPositions:[],teamId:id,attributes,overall,potential:integer(overall,99),fatigue:0,healthy:true}
  })}
}
