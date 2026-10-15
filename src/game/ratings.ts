import type { Attribute } from './model'
export const ratingBands = [
 {key:'rating-low',label:'Faible',min:0,max:39},
 {key:'rating-developing',label:'À développer',min:40,max:54},
 {key:'rating-neutral',label:'Correct',min:55,max:69},
 {key:'rating-good',label:'Bon',min:70,max:84},
 {key:'rating-excellent',label:'Très bon',min:85,max:99},
] as const
export function rating(value:number) {return ratingBands.find(band=>value<=band.max)??ratingBands[4]}
export const attributeGroups:{label:string;attributes:Attribute[]}[]=[
 {label:'Adresse',attributes:['insideScoring','midRange','threePoint','freeThrows']},
 {label:'Finition',attributes:['dunk','layup','postMoves']},
 {label:'Création',attributes:['dribbling','passing','courtVision','iq']},
 {label:'Défense',attributes:['perimeterDefense','interiorDefense','blocks','steals']},
 {label:'Physique et rebond',attributes:['speed','acceleration','strength','vertical','stamina','rebounding']},
]
