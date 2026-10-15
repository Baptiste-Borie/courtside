import { onMounted, onUnmounted, ref } from 'vue'
export function useViewport(){
 const width=ref(window.innerWidth),height=ref(window.innerHeight)
 function update(){width.value=window.innerWidth;height.value=window.innerHeight}
 onMounted(()=>window.addEventListener('resize',update));onUnmounted(()=>window.removeEventListener('resize',update))
 return {width,height}
}
