<script setup lang="ts">
import { computed, ref } from 'vue'
import { teamProfile } from './game/analysis'
import type { Team, Tactic } from './game/model'
import { tactics } from './game/model'
import GameDialog from './GameDialog.vue'
import Pager from './Pager.vue'
import PlayerCard from './PlayerCard.vue'
import PlayerAvatar from './PlayerAvatar.vue'
const dossiers=ref<InstanceType<typeof GameDialog>|null>(null),help=ref<InstanceType<typeof GameDialog>|null>(null),page=ref(0)
const props=defineProps<{club:Team|null;opponent:Team;tactic:Tactic;day:number;matchDay:number|null;year:number}>()
const ours=computed(()=>props.club?teamProfile(props.club):null)
const theirs=computed(()=>teamProfile(props.opponent))
const countdown=computed(()=>props.matchDay===null?'À programmer':props.matchDay<=props.day?'C’est le jour du match':`Match dans ${props.matchDay-props.day} jour${props.matchDay-props.day>1?'s':''}`)
const descriptions:Record<Tactic,string>={balanced:'Des occasions réparties entre finition et tir extérieur.',fast:'De la vitesse, du mouvement et des attaques vers le cercle.',inside:'Du jeu au poste, de la puissance et de la finition.'}
</script>
<template><section class="match-preview matchup-room" aria-labelledby="preview-title"><div class="matchup-kicker"><span class="match-state">{{ countdown }}</span><span>3×3 · PREMIER À 21</span></div><h2 id="preview-title" class="sr-only">Face à {{ opponent.name }}</h2><div class="matchup-versus"><div><small>TON ÉQUIPE</small><strong>{{ club?.name??'Trois titulaires à choisir' }}</strong></div><span class="versus-mark">VS</span><div><small>ADVERSAIRE</small><strong>{{ opponent.name }}</strong></div></div>
<div class="matchup-lineups"><div v-for="(team,side) in [club,opponent]" :key="side" class="matchup-three"><div v-for="player in team?.players??[]" :key="player.id" class="matchup-player"><PlayerAvatar :player="player" /><span>{{ player.firstName[0] }}. {{ player.lastName }}</span><b>{{ player.overall }}<small>NIV</small></b></div><p v-if="!team">Choisis tes joueurs dans Mon équipe.</p></div></div>
<div class="matchup-plan"><span class="plan-icon" aria-hidden="true">↗</span><div><small>TON PLAN DE JEU</small><strong>{{ tactics[tactic] }}</strong><p>{{ descriptions[tactic] }}</p></div><span class="readiness" :class="{'is-tired':club?.players.some(player=>player.fatigue>20)}">{{ !club?'Équipe incomplète':club.players.some(player=>player.fatigue>20)?'Fatigue à surveiller':'Trois titulaires prêts' }}</span></div>
<div class="preview-actions"><button @click="dossiers?.open()">Voir les trois adversaires</button><button @click="help?.open()">Comparer les équipes ↗</button></div>
<GameDialog ref="help" title="Comparer les équipes"><div v-if="ours" class="comparison-axes"><div v-for="(axis,i) in ours" :key="axis.id" class="comparison-axis"><span>{{ axis.label }}</span><b>{{ axis.value }}</b><div class="axis-tracks"><i :style="{width:`${axis.value}%`}"></i><i :style="{width:`${theirs[i]!.value}%`}"></i></div><b>{{ theirs[i]!.value }}</b></div><p class="comparison-key"><span>■ Ton équipe</span><span>■ {{ opponent.name }}</span></p></div><p v-else>Choisis trois titulaires pour comparer les formations.</p><p>Profils sur 100, fatigue actuelle incluse. Taille, duels, choix de tir et hasard comptent aussi. La récupération à venir n’est pas anticipée.</p><p>Plan {{ tactics[tactic] }} : environ {{ tactic==='inside'?12:tactic==='fast'?28:35 }} % des tirs de loin. La tactique adverse est équilibrée.</p></GameDialog>
<GameDialog ref="dossiers" title="Les adversaires"><Pager v-model:page="page" :pages="3" label="Adversaires" /><PlayerCard :player="opponent.players[page]!" :year="year" mode="reveal" /></GameDialog></section></template>
