// Marge de progression tirée à la naissance du joueur, pas une baisse annuelle.
// Courbe et exceptions sont des choix d'équilibrage, pas une loi sportive.
export function potentialForAge(overall:number,age:number,roll:number):number {
 const draw=Math.max(0,Math.min(.999999,roll)),years=Math.max(18,Math.min(45,age))
 const budget=Math.max(3,38-(years-18)*2.2)
 const growth=draw<.08?Math.round(draw/.08*5):draw>.96?Math.round(12+(draw-.96)/.04*10):Math.round(budget*(.2+.8*(draw-.08)/.88))
 return Math.min(99,overall+growth)
}
