<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateTeam } from './game/generate'
import { attributeLabels, tactics, type MatchResult, type Tactic } from './game/model'
import { simulate } from './game/simulate'
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

<template>
  <main>
    <header><div><p class="eyebrow">1983 · France · Laboratoire 3v3</p><h1>Courtside</h1></div><span class="tag">Prototype 001</span></header>
    <p>Composez une identité de jeu, puis confrontez vos trois joueurs. Premier à 21, paniers à 1 et 2 points.</p>
    <div class="toolbar">
      <label>Seed des équipes <input v-model.number="worldSeed" type="number" min="0" max="4294967294" /></label>
      <button @click="regenerate">Générer les équipes</button>
      <label>Seed du match <input v-model.number="matchSeed" type="number" min="0" max="4294967294" /></label>
      <button class="primary" @click="play">Simuler le match</button>
      <button @click="matchSeed = (matchSeed + 1) % 4294967295; play()">Nouveau tirage</button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
    <section v-if="result" class="result" aria-live="polite">
      <p class="eyebrow">Résultat · Seed {{ result.seed }}</p>
      <h2>{{ teams[0]!.name }} <strong>{{ result.scores[0] }} — {{ result.scores[1] }}</strong> {{ teams[1]!.name }}</h2>
      <p>{{ winner }} remporte le match · {{ result.possessions }} séquences simulées</p>
      <p class="hint">Le même effectif, les mêmes tactiques et la même seed reproduisent ce résultat.</p>
    </section>
    <div class="teams">
      <section v-for="(team, side) in teams" :key="team.id" class="team">
        <div class="team-head"><h2>{{ team.name }}</h2><label>Tactique <select v-model="choices[side]"><option v-for="(name, key) in tactics" :key="key" :value="key">{{ name }}</option></select></label></div>
        <p class="hint">{{ choices[side] === 'inside' ? 'Privilégie la finition, la force et le jeu au poste.' : choices[side] === 'fast' ? 'Privilégie vitesse, création et finition rapide.' : 'Répartit les occasions entre jeu intérieur et extérieur.' }}</p>
        <article v-for="player in team.players" :key="player.id">
          <div class="player-title"><h3>{{ player.firstName }} {{ player.lastName }}</h3><span class="tag">{{ player.position === 'G' ? 'Meneur' : player.position === 'W' ? 'Ailier' : 'Intérieur' }}</span></div>
          <p class="hint">{{ 1983 - player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Moyenne {{ player.overall }} · Potentiel {{ player.potential }}</p>
          <div class="strengths"><span v-for="([key, value]) in Object.entries(player.attributes).sort((a,b) => b[1]-a[1]).slice(0,3)" :key="key">{{ attributeLabels[key as keyof typeof attributeLabels] }} <b>{{ value }}</b></span></div>
          <details><summary>Les 21 caractéristiques</summary><dl><div v-for="(label, key) in attributeLabels" :key="key"><dt>{{ label }}</dt><dd>{{ player.attributes[key] }}</dd></div></dl></details>
        </article>
        <div v-if="result" class="table-wrap"><table><caption>Dernier match · {{ tactics[playedTactics[side]!] }}</caption><thead><tr><th>Joueur</th><th>PTS</th><th>REB</th><th>PD</th><th>INT</th><th>CTR</th><th>Tirs</th></tr></thead><tbody><tr v-for="(line,i) in result.stats[side]" :key="line.playerId"><th>{{ team.players[i]!.firstName }}</th><td>{{ line.points }}</td><td>{{ line.rebounds }}</td><td>{{ line.assists }}</td><td>{{ line.steals }}</td><td>{{ line.blocks }}</td><td>{{ line.made }}/{{ line.attempted }}</td></tr></tbody></table></div>
      </section>
    </div>
    <footer>Notes 0–99 · La moyenne décrit un joueur, elle ne décide pas du résultat. Les lancers francs et la progression ne sont pas encore simulés.</footer>
  </main>
</template>
