// Marge de progression tirée à la naissance du joueur, pas une baisse annuelle.
// Courbe et exceptions sont des choix d'équilibrage, pas une loi sportive.
export function potentialForAge(overall:number,age:number,roll:number):number {
 const draw=Math.max(0,Math.min(.999999,roll)),years=Math.max(18,Math.min(45,age))
 const budget=Math.max(3,38-(years-18)*2.2)
 const growth=draw<.08?Math.round(draw/.08*5):draw>.96?Math.round(12+(draw-.96)/.04*10):Math.round(budget*(.2+.8*(draw-.08)/.88))
 return Math.min(99,overall+growth)
}

// Le plafond global tient compte du relief du joueur, sans exiger qu'un
// spécialiste soit déjà bon partout. Les paliers d'âge modulent l'occasion
// de progresser ; ils ne retirent jamais du potentiel à un joueur sauvegardé.
export function potentialForTalent(overall:number,age:number,attributes:Record<string,number>,roll:number):number {
 const draw=Math.max(0,Math.min(.999999,roll))
 const skills=Object.entries(attributes).filter(([key])=>!['iq','stamina','speed','acceleration','strength','vertical','freeThrows'].includes(key)).map(([,value])=>value).sort((a,b)=>b-a)
 const best=skills[0]??overall,second=skills[1]??overall
 const roleLevel=skills.length?skills.slice(0,5).reduce((sum,value)=>sum+value,0)/Math.min(5,skills.length):overall
 const opportunity=age<=20?.5:age<=24?.4:age<=29?.25:.1
 const headroom=draw<.08?3:4+28*draw*draw+Math.max(0,roleLevel-overall)*opportunity
 // Une qualité technique à 95 si jeune est un signal exceptionnel ; deux
 // sont encore plus rares. La moyenne globale ne doit pas l'effacer.
 const precocity=age<=20?(second>=95?88:best>=95?80:second>=90?80:best>=90?75:0):0
 return Math.min(99,Math.max(overall,precocity,Math.round(overall+headroom)))
}
