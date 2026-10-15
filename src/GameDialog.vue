<script setup lang="ts">
import { ref } from 'vue'
defineProps<{title:string}>()
const dialog=ref<HTMLDialogElement|null>(null)
defineExpose({open:()=>{if(!dialog.value?.open)dialog.value?.showModal()},close:()=>dialog.value?.close()})
</script>
<template><Teleport to="body"><dialog ref="dialog" class="game-dialog" :aria-label="title"><header><h2>{{ title }}</h2><form method="dialog"><button :aria-label="`Fermer ${title}`">Fermer ×</button></form></header><div class="game-dialog-content"><slot /></div></dialog></Teleport></template>
