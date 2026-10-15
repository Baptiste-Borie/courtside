<script setup lang="ts">
import { computed } from 'vue'
import PlayerCard from './PlayerCard.vue'
import { foundingCandidates, type Founding } from './game/founding'
const props=defineProps<{name:string;founding:Founding;saveStatus:string;error:string}>()
const emit=defineEmits<{'update:name':[value:string];pick:[id:string];confirm:[];restart:[]}>()
const candidates=foundingCandidates()
const chosen=computed(()=>props.founding.selected.map(id=>candidates.find(player=>player.id===id)!))
</script>
<template>
<div class="founding-screen">
  <header class="founding-header"><a class="brand" href="#" @click.prevent><svg class="brand-ball" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="currentColor"/><path d="M2 16h28M16 2v28M6 6c14 7 14 13 0 20M26 6c-14 7-14 13 0 20" fill="none" stroke="#19251f" stroke-width="1.5"/></svg> COURTSIDE<span class="brand-edition">1983</span></a><span class="chapter-label">LE DÉBUT DE QUELQUE CHOSE</span></header>
  <main class="founding-main">
    <section class="founding-intro"><div><p class="eyebrow">FRANCE · PRINTEMPS 1983 · CHAPITRE 01</p><h1>Tout commence<br>sur le <em>bitume.</em></h1><p class="intro-copy">Un panier, quelques habitués et une place à prendre. Tu montes ton équipe de streetball pour entrer dans le circuit local.</p><p>Douze joueurs sont prêts à tenter l’aventure. Choisis les six qui porteront tes couleurs.</p><label class="club-name-label" for="founding-name">Le nom de ton équipe</label><input id="founding-name" aria-label="Nom de ton équipe" :value="name" maxlength="40" @input="emit('update:name',($event.target as HTMLInputElement).value)" /></div>
      <div class="court-poster" aria-hidden="true"><div class="poster-copy"><span>LE TERRAIN EST À VOUS.</span><b>3×3</b></div><svg viewBox="0 0 400 400"><path d="M40 30h320v340H40zM40 200h320"/><circle cx="200" cy="200" r="48"/><path d="M135 30v95h130V30M135 370v-95h130v95"/><path d="M75 30v35a125 125 0 0 0 250 0V30M75 370v-35a125 125 0 0 1 250 0v35"/><circle cx="200" cy="88" r="8"/><circle cx="200" cy="312" r="8"/></svg><span class="poster-footer">UNE ÉQUIPE. VOTRE HISTOIRE.</span></div>
    </section>
    <div class="draft-heading"><div><p class="eyebrow">LES GENS DU PLAYGROUND</p><h2>Qui embarque avec toi ?</h2></div><p>6 joueurs dans l’effectif.<br>3 sur le terrain, 3 sur le banc.</p></div>
    <p class="hint">Combine les profils : tir, création, défense, puissance. Tu choisiras tes trois titulaires après la sélection. Ce premier effectif est gratuit.</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <div class="draft-grid"><PlayerCard v-for="(player,index) in candidates" :key="player.id" :player="player" :index="index" mode="draft" :chosen="founding.selected.includes(player.id)" :disabled="founding.selected.length===6&&!founding.selected.includes(player.id)" @toggle="emit('pick',player.id)" /></div>
    <section class="founding-confirm" aria-label="Votre sélection"><div><p class="eyebrow">L’ÉQUIPE PREND FORME</p><h2>{{ founding.selected.length }}<span>/6 joueurs</span></h2><p class="chosen-names">{{ chosen.map(player=>`${player.firstName} ${player.lastName}`).join(' · ') || 'Tes premières recrues t’attendent.' }}</p><p class="hint" role="status">{{ saveStatus }}</p></div><button class="primary" :disabled="founding.selected.length!==6||!name.trim()" @click="emit('confirm')">Entrer dans le circuit <span aria-hidden="true">↗</span></button></section>
  </main>
  <footer class="founding-footer">COURTSIDE · UNE CARRIÈRE À CONSTRUIRE<button @click="emit('restart')">Recommencer la sélection</button></footer>
</div>
</template>
