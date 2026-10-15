<script setup lang="ts">
defineProps<{page:number;pages:number;label:string}>()
const emit=defineEmits<{'update:page':[value:number]}>()
</script>
<template><nav v-if="pages>1" class="game-pager" :aria-label="label"><button type="button" :aria-label="`${label} : précédent`" :disabled="page===0" @click="emit('update:page',page-1)">←</button><span>{{ page+1 }} / {{ pages }}</span><button type="button" :aria-label="`${label} : suivant`" :disabled="page>=pages-1" @click="emit('update:page',page+1)">→</button></nav></template>
