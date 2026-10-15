<script setup lang="ts">
import { ref } from 'vue'
import CourtPoster from './CourtPoster.vue'
defineProps<{hasSave:boolean;canContinue:boolean;clubName:string;completed:boolean;reduceMotion:boolean;saveStatus:string}>()
const emit=defineEmits<{start:[];resume:[];'update:reduceMotion':[value:boolean]}>()
const settings=ref<HTMLDialogElement|null>(null)
</script>
<template>
<div class="game-menu">
  <header class="menu-brand"><span>COURTSIDE</span><small>1983 / DU BITUME AUX SOMMETS</small></header>
  <main class="menu-scene"><div class="menu-copy"><p class="eyebrow">UNE CARRIÈRE À CONSTRUIRE</p><h1>Ton équipe.<br>Ton <em>histoire.</em></h1><p>France, 1983. Tout commence sur un playground.</p><div class="menu-choices"><button aria-label="Continuer" class="primary" :disabled="!hasSave||!canContinue" @click="emit('resume')">Continuer <span aria-hidden="true">↗</span><small v-if="hasSave&&canContinue">{{ completed?clubName:'Création du club en cours' }}</small></button><button @click="emit('start')">Nouvelle carrière <span aria-hidden="true">↗</span></button><button @click="settings?.showModal()">Paramètres</button></div><p v-if="hasSave&&!canContinue" class="hint" role="status">{{ saveStatus }}</p><p v-else class="menu-save-hint">{{ hasSave?'Ta partie est conservée dans ce navigateur.':'Une équipe attend son histoire.' }}</p></div><CourtPoster /></main>
  <footer class="menu-bottom">COURTSIDE / JEU SOLO <span>FRANCE · PRINTEMPS 1983</span></footer>
  <dialog ref="settings" class="settings-dialog" aria-labelledby="settings-title"><form method="dialog"><p class="eyebrow">CONFORT DE JEU</p><h2 id="settings-title">Paramètres</h2><label class="motion-setting"><input type="checkbox" :checked="reduceMotion" @change="emit('update:reduceMotion',($event.target as HTMLInputElement).checked)" />Réduire les animations</label><p class="hint">La préférence de ton système est également respectée. Le choix est conservé dans ce navigateur.</p><button class="primary">Fermer</button></form></dialog>
</div>
</template>
