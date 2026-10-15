<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Player } from './game/model'
import type { ScoutingState } from './game/scouting'
import { recruitmentCost } from './game/scouting'
import PlayerCard from './PlayerCard.vue'
import Pager from './Pager.vue'
const props=defineProps<{state:ScoutingState;roster:Player[];money:number;year:number;returnDate:string|null}>()
const emit=defineEmits<{launch:[];reveal:[];finish:[];hire:[id:string]}>()
const tab=ref<'mission'|'known'>('mission'),page=ref(0)
const known=computed(()=>props.state.pool.filter(p=>props.state.known.includes(p.id)))
const latest=computed(()=>props.state.pool.find(p=>p.id===props.state.campaign?.[props.state.revealed-1]))
watch(()=>props.state.campaign,(next,old)=>{if(!next&&old){tab.value='known';page.value=Math.max(0,known.value.length-3)}})
</script>
<template><section class="scout-board screen-panel"><div class="game-tabs"><button :aria-pressed="tab==='mission'" @click="tab='mission'">Mission</button><button :aria-pressed="tab==='known'" @click="tab='known'">Les joueurs observés · {{ known.length }}</button></div>
<template v-if="tab==='mission'"><div v-if="!state.campaign" class="mission-brief"><p class="eyebrow">RÉSEAU LOCAL / SCOUTING</p><h2>Les prochaines rencontres.</h2><p>Un observateur, sept jours sur les playgrounds, trois dossiers à découvrir.</p><strong class="mission-price">50 F</strong><p class="hint">Découvrir un joueur ne le recrute pas. Effectif {{ roster.length }}/10.</p><button class="primary" :disabled="money<50||known.length===30" @click="emit('launch')">Lancer un scouting · 50 F</button></div>
<div v-else-if="returnDate" class="mission-brief"><p class="eyebrow">OBSERVATEUR SUR LE TERRAIN</p><h2>Les pistes se précisent.</h2><p>Retour prévu le {{ returnDate }}.</p><p class="hint">Avance au prochain événement pour recevoir les dossiers.</p></div>
<div v-else class="scout-reveal"><div class="panel-controls"><span>{{ state.revealed }}/{{ state.campaign.length }} dossiers révélés</span><button v-if="state.revealed<state.campaign.length" class="primary" @click="emit('reveal')">Révéler le prochain dossier</button><button v-else class="primary" @click="emit('finish')">Terminer la campagne</button></div><PlayerCard v-if="latest" :player="latest" :year="year" mode="reveal" /><p v-else class="empty-state">Le premier dossier t’attend.</p></div></template>
<template v-else><div v-if="known.length" class="scout-dossiers"><Pager v-model:page="page" :pages="known.length" label="Dossiers" /><PlayerCard :key="known[page]?.id" :player="known[page]!" :year="year" mode="scout" :cost="recruitmentCost(known[page]!)" :hired="roster.some(p=>p.id===known[page]!.id)" :disabled="money<recruitmentCost(known[page]!)||roster.length>=10" @hire="emit('hire',known[page]!.id)" /></div><p v-else class="empty-state">Lance une mission pour découvrir tes premiers joueurs.</p></template></section></template>
