<script setup lang="ts">
import { computed, ref } from 'vue'
import { circuits, type Career, type CircuitId } from './game/circuit'
import { dateLabel } from './game/calendar'
import Pager from './Pager.vue'
const props=defineProps<{career:Career}>()
const emit=defineEmits<{choose:[id:CircuitId]}>()
const tab=ref('competitions'),index=ref(0),page=ref(0)
const ids=Object.keys(circuits) as CircuitId[]
const current=computed(()=>circuits[ids[index.value]!])
const history=computed(()=>[...props.career.history].reverse())
</script>
<template><section class="screen-panel circuit-board"><div class="game-tabs"><button :aria-pressed="tab==='competitions'" @click="tab='competitions'">Compétitions</button><button :aria-pressed="tab==='history'" @click="tab='history'">Palmarès · {{ history.length }}</button></div>
<template v-if="tab==='competitions'"><Pager v-model:page="index" :pages="ids.length" label="Compétitions" /><article class="circuit-card"><p class="eyebrow">{{ career.reputation>=current.threshold?'Accessible':`Verrouillé · ${current.threshold} réputation requise` }}</p><h2>{{ current.name }}</h2><p>{{ index===0?'Le premier défi du playground.':index===1?'Le quartier a entendu parler de toi. La ville t’attend.':'Les meilleures équipes du circuit régional.' }}</p><dl><div><dt>Format</dt><dd>4 équipes · 3 matchs</dd></div><div><dt>Dotation</dt><dd>{{ 300*current.multiplier }} / {{ 200*current.multiplier }} / {{ 125*current.multiplier }} / {{ 75*current.multiplier }} F</dd></div><div><dt>Réputation requise</dt><dd>{{ current.threshold }}</dd></div></dl><button class="primary" :disabled="career.reputation<current.threshold||career.active!==null" @click="emit('choose',ids[index]!)">Choisir cette compétition</button></article></template>
<template v-else><template v-if="history.length"><Pager v-model:page="page" :pages="history.length" label="Palmarès" /><article class="history-card"><p class="eyebrow">ÉDITION {{ history[page]!.edition }} / {{ dateLabel(history[page]!.day) }}</p><h2>{{ circuits[history[page]!.circuit].name }}</h2><strong class="history-rank">{{ history[page]!.rank }}<small>{{ history[page]!.rank===1?'er':'e' }}</small></strong><dl><div><dt>Victoires</dt><dd>{{ history[page]!.wins }}/3</dd></div><div><dt>Gains</dt><dd>{{ history[page]!.reward }} F</dd></div><div><dt>Réputation</dt><dd>+{{ history[page]!.reputation }}</dd></div></dl></article></template><p v-else class="empty-state">Tes prochains résultats écriront le palmarès du club.</p></template></section></template>
