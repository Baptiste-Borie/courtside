<script setup lang="ts">
import { computed } from 'vue'
import type { Calendar } from './game/calendar'
import { dateLabel } from './game/calendar'
import type { Tournament } from './game/tournament'
import { matchAgenda } from './game/match-agenda'
const props=defineProps<{calendar:Calendar;tournament:Tournament|null;completedDay?:number;viewedRound:number|null}>()
defineEmits<{select:[round:number]}>()
const games=computed(()=>props.tournament?matchAgenda(props.tournament,props.calendar,props.completedDay):[])
function shortDate(day:number|null){return day===null?'Date non conservée':new Date(Date.UTC(1983,3,1+day)).toLocaleDateString('fr-FR',{day:'numeric',month:'short',timeZone:'UTC'})}
const active=computed(()=>props.viewedRound??(props.tournament?.finished?props.tournament.round:(props.tournament?.round??0)+1))
</script>
<template><section class="match-calendar" aria-label="Calendrier des matchs"><div class="agenda-today"><span class="eyebrow">LE CALENDRIER</span><strong>{{ dateLabel(calendar.day).replace(/ \d{4}$/, '') }}</strong><small>{{ tournament?.finished?'Compétition terminée':tournament?'Trois matchs. Un titre.':'En attendant le premier défi' }}</small></div><div v-if="games.length" class="agenda-games"><button v-for="game in games" :key="game.round" class="agenda-game" :class="[game.status,{'is-viewed':active===game.round}]" :aria-label="`Match ${game.round} · ${game.opponent.name} · ${game.score??'à venir'}`" :aria-pressed="active===game.round" :disabled="game.status==='later'" @click="$emit('select',game.round)"><span class="agenda-date">{{ shortDate(game.day) }} <small>J{{ game.round }}</small></span><strong>{{ game.opponent.name }}</strong><span class="agenda-outcome"><b v-if="game.score">{{ game.status==='win'?'V':'D' }} · {{ game.score }}</b><template v-else>{{ game.status==='next'?'PROCHAIN MATCH':'À VENIR' }}</template><i v-if="game.status==='next'" aria-hidden="true">↗</i></span></button></div><p v-else class="agenda-empty">Inscris ton équipe pour programmer les trois rencontres.</p></section></template>
