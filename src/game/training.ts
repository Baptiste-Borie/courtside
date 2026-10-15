import type { Attribute, Player } from './model'
export const trainingCost=100
export const trainingLabels={shooting:'Tir extérieur',creation:'Création',defense:'Défense',inside:'Jeu intérieur'} as const
export type TrainingFocus=keyof typeof trainingLabels
export interface Training { playerId:string; focus:TrainingFocus; day:number }
const focuses:Record<TrainingFocus,Attribute[]>={shooting:['threePoint','insideScoring'],creation:['passing','courtVision'],defense:['perimeterDefense','steals'],inside:['postMoves','layup']}
export function train(player:Player,focus:TrainingFocus):{player:Player;gains:{attribute:Attribute;amount:number}[]} {
 const next={...player,attributes:{...player.attributes}},gains:{attribute:Attribute;amount:number}[]=[]
 let budget=Math.max(0,player.potential*Object.keys(player.attributes).length-Object.values(player.attributes).reduce((a,b)=>a+b,0))
 for(const attribute of focuses[focus]) {
  const amount=Math.min(1,99-next.attributes[attribute],budget)
  if(amount>0){next.attributes[attribute]+=amount;budget-=amount;gains.push({attribute,amount})}
 }
 if(gains.length)next.fatigue=Math.min(100,next.fatigue+8)
 next.overall=Math.round(Object.values(next.attributes).reduce((a,b)=>a+b,0)/Object.keys(next.attributes).length)
 return {player:next,gains}
}
export function startTraining(roster:Player[],money:number,playerId:string,focus:TrainingFocus,day:number,pending:Training|null) {
 const player=roster.find(p=>p.id===playerId)
 if(pending)throw Error('Un camp est déjà en cours.')
 if(!player)throw Error('Choisissez un joueur de votre équipe.')
 if(money<trainingCost)throw Error('Il faut 100 F pour financer ce camp.')
 if(!train(player,focus).gains.length)throw Error('Ce joueur ne peut plus progresser sur cet axe.')
 return {training:{playerId,focus,day:day+7},money:money-trainingCost}
}
