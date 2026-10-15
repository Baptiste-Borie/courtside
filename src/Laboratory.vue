<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateTeam } from './game/generate'
import { tactics, type MatchResult, type Tactic } from './game/model'
import { simulate } from './game/simulate'
import PlayerCard from './PlayerCard.vue'
import Pager from './Pager.vue'
import GameDialog from './GameDialog.vue'
const stats=ref<InstanceType<typeof GameDialog>|null>(null)
const side=ref<0|1>(0),playerIndex=ref(0)
const worldSeed = ref(1983), matchSeed = ref(42)
const teams = ref([generateTeam(1983, 'a', 'Les Échos'), generateTeam(1984, 'b', 'Les Docks')])
const choices = ref<Tactic[]>(['balanced', 'balanced'])
const result = ref<MatchResult | null>(null)
const error = ref('')
const playedTactics = ref<Tactic[]>(['balanced', 'balanced'])
const winner = computed(() => teams.value.find(t => t.id === result.value?.winner)?.name)
function regenerate() {
  if (!validSeed(worldSeed.value)) return
  teams.value = [generateTeam(worldSeed.value, 'a', 'Les Échos'), generateTeam(worldSeed.value + 1, 'b', 'Les Docks')]
  result.value = null; error.value = ''
}
function validSeed(seed: number) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967294) { error.value = 'Utilisez une seed entière entre 0 et 4 294 967 294.'; return false }
  return true
}
function play() {
  if (!validSeed(matchSeed.value)) return
  error.value = ''
  playedTactics.value = [...choices.value]
  result.value = simulate(teams.value[0]!, teams.value[1]!, choices.value[0]!, choices.value[1]!, matchSeed.value)
}
</script>

<template><section class="screen-panel lab-board"><div class="lab-controls"><label>Seed des équipes<input v-model.number="worldSeed" type="number" min="0" max="4294967294" /></label><button @click="regenerate">Générer les équipes</button><label>Seed du match<input v-model.number="matchSeed" type="number" min="0" max="4294967294" /></label><button class="primary" @click="play">Simuler le match</button><button @click="matchSeed=(matchSeed+1)%4294967295;play()">Nouveau tirage</button></div><p v-if="error" role="alert">{{ error }}</p><div v-if="result" class="lab-result result"><strong>{{ result.scores[0] }} — {{ result.scores[1] }}</strong><span>{{ winner }} · Seed {{ result.seed }} · {{ result.possessions }} séquences · {{ tactics[playedTactics[side]!] }}</span><button @click="stats?.open()">Statistiques ↗</button></div><div class="panel-controls"><label>Équipe<select v-model="side"><option :value="0">{{ teams[0]!.name }}</option><option :value="1">{{ teams[1]!.name }}</option></select></label><label>Tactique<select v-model="choices[side]"><option v-for="(label,key) in tactics" :key="key" :value="key">{{ label }}</option></select></label><Pager v-model:page="playerIndex" :pages="3" label="Joueurs du laboratoire" /></div><PlayerCard :player="teams[side]!.players[playerIndex]!" mode="reveal" /><p class="hint">Même seed, mêmes joueurs et mêmes tactiques : même résultat.</p><GameDialog ref="stats" title="Statistiques du laboratoire"><template v-if="result"><div class="game-tabs"><button v-for="(team,index) in teams" :key="team.id" :aria-pressed="side===index" @click="side=index as 0|1">{{ team.name }}</button></div><table><thead><tr><th>Joueur</th><th>PTS</th><th>REB</th><th>PD</th><th>INT</th><th>CTR</th><th>Tirs</th></tr></thead><tbody><tr v-for="(line,index) in result.stats[side]" :key="line.playerId"><th>{{ teams[side]!.players[index]!.firstName }}</th><td>{{ line.points }}</td><td>{{ line.rebounds }}</td><td>{{ line.assists }}</td><td>{{ line.steals }}</td><td>{{ line.blocks }}</td><td>{{ line.made }}/{{ line.attempted }}</td></tr></tbody></table></template></GameDialog></section></template>
