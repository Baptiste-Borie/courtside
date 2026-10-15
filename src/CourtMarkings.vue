<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { courtGeometry } from './game/court'
const svg=ref<SVGSVGElement|null>(null),size=ref({width:600,height:650})
const court=computed(()=>courtGeometry(size.value.width,size.value.height))
let observer:ResizeObserver|undefined
function measure(){
  const box=svg.value?.getBoundingClientRect()
  if(box&&box.width>0&&box.height>0)size.value={width:box.width,height:box.height}
}
onMounted(()=>{measure();observer=new ResizeObserver(measure);if(svg.value)observer.observe(svg.value)})
onUnmounted(()=>observer?.disconnect())
</script>
<template>
<svg ref="svg" class="lineup-court-lines" :viewBox="`0 0 ${court.width} ${court.height}`" aria-hidden="true">
  <path class="court-outline" :d="court.outline" />
  <path :d="court.paint" />
  <path :d="court.arc" />
  <circle class="court-free-throw-circle" :cx="court.centerX" :cy="court.freeThrowY" :r="court.radius" />
  <path :d="court.backboard" />
  <circle :cx="court.centerX" :cy="court.basketY" :r="court.hoopRadius" />
  <path class="court-center-arc" :d="court.centerArc" :data-center-x="court.centerX" :data-center-y="court.bottom" :data-radius="court.radius" />
</svg>
</template>
