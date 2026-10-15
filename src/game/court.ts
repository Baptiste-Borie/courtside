// Tracés décoratifs : les dimensions suivent le cadre, les rayons restent circulaires.
export function courtGeometry(width:number,height:number) {
  const left=width/24,right=width*23/24,top=height/26,bottom=height*25/26
  const centerX=width/2,radius=Math.min(width,height)/8
  const basketY=top+height*.1,freeThrowY=top+height*.3
  const arcRadius=(right-left)*.425
  return {
    width,height,left,top,right,bottom,centerX,radius,basketY,freeThrowY,
    outline:`M${left} ${top}H${right}V${bottom}H${left}Z`,
    paint:`M${centerX-radius} ${top}V${freeThrowY}H${centerX+radius}V${top}`,
    arc:`M${centerX-arcRadius} ${top}V${basketY}A${arcRadius} ${arcRadius} 0 0 0 ${centerX+arcRadius} ${basketY}V${top}`,
    centerArc:`M${centerX-radius} ${bottom}A${radius} ${radius} 0 0 1 ${centerX+radius} ${bottom}`,
    backboard:`M${centerX-radius*.4} ${basketY-20}H${centerX+radius*.4}`,
    hoopRadius:Math.min(width,height)/48,
  }
}
