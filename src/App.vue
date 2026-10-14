<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import Laboratory from './Laboratory.vue'
import { attributeLabels, tactics, type Tactic } from './game/model'
import { createRoster, playRound, startTournament, type Tournament } from './game/tournament'
const lab = ref(false), name = ref('Les Aurores'), roster = shallowRef(createRoster(1983))
const selected = ref(roster.value.slice(0,3).map(p=>p.id)), tactic = ref<Tactic>('balanced')
const tournament = shallowRef<Tournament | null>(null), money=ref(0), titles=ref(0), edition=ref(0), error=ref('')
const lastMatch=computed(()=>tournament.value?.matches.filter(m=>m.home==='club'||m.away==='club').at(-1))
const opponent=computed(()=>tournament.value && !tournament.value.finished ? tournament.value.teams[tournament.value.round+1] : null)
function toggle(id:string) { selected.value=selected.value.includes(id)?selected.value.filter(x=>x!==id):selected.value.length<3?[...selected.value,id]:selected.value }
function start() {
 try { tournament.value=startTournament(1983+edition.value,roster.value,selected.value,name.value);edition.value++;error.value='' }
 catch(e) {error.value=(e as Error).message}
}
function play() {
 try {
  const next=playRound(tournament.value!,roster.value,selected.value,tactic.value)
  tournament.value=next
  if(next.finished) {money.value+=next.reward;if(next.rank===1)titles.value++}
  error.value=''
 } catch(e) {error.value=(e as Error).message}
}
function teamName(id:string) {return tournament.value?.teams.find(t=>t.id===id)?.name}
</script>
<template>
  <nav class="mode-nav"><button @click="lab=false" :aria-pressed="!lab">Mon équipe</button><button @click="lab=true" :aria-pressed="lab">Laboratoire</button></nav>
  <Laboratory v-if="lab" />
  <main v-else>
    <header><div><p class="eyebrow">France · 1983 · Circuit local</p><h1>Votre premier playground</h1></div><span class="tag">{{ money }} F · {{ titles }} titre{{ titles > 1 ? 's' : '' }}</span></header>
    <p>Six joueurs, trois places sur le terrain. Construisez votre équipe et disputez la Coupe du quartier.</p>
    <div class="toolbar"><label>Nom de votre équipe<input v-model="name" :disabled="!!tournament && !tournament.finished" maxlength="40" /></label><label>Tactique<select v-model="tactic"><option v-for="(label,key) in tactics" :value="key" :key="key">{{ label }}</option></select></label><button v-if="!tournament || tournament.finished" class="primary" :disabled="selected.length!==3" @click="start">{{ tournament ? 'Participer au prochain tournoi' : 'Inscrire mon équipe' }}</button></div>
    <p v-if="error" role="alert">{{ error }}</p>
    <section v-if="tournament" class="result">
      <p class="eyebrow">Coupe du quartier · Édition {{ edition }}</p>
      <template v-if="!tournament.finished"><h2>Match {{ tournament.round+1 }} sur 3 · {{ opponent?.name }}</h2><p>Chaque équipe affronte les trois autres. Vous pouvez changer vos titulaires et votre tactique entre les matchs.</p><button class="primary" :disabled="selected.length!==3" @click="play">Jouer le prochain match</button></template>
      <template v-else><h2>{{ tournament.rank===1 ? 'Champions du quartier !' : `Tournoi terminé : ${tournament.rank}e place` }}</h2><p>{{ tournament.reward }} F gagnés. {{ tournament.rank===1 ? 'Un premier titre pour votre équipe.' : 'Essayez une autre composition au prochain tournoi.' }}</p><p class="hint">L'argent sera utilisable pour le scouting dans le prochain patch.</p></template>
    </section>
    <section v-if="lastMatch" class="result" aria-live="polite"><p class="eyebrow">Dernier match</p><h2>{{ teamName(lastMatch.home) }} <strong>{{ lastMatch.result.scores[0] }} — {{ lastMatch.result.scores[1] }}</strong> {{ teamName(lastMatch.away) }}</h2><p>{{ lastMatch.result.winner==='club'?'Victoire !':'Défaite.' }}</p><div class="table-wrap"><table><caption>Vos joueurs lors de ce match</caption><thead><tr><th>Joueur</th><th>PTS</th><th>REB</th><th>PD</th><th>INT</th><th>CTR</th></tr></thead><tbody><tr v-for="line in lastMatch.result.stats[lastMatch.home==='club'?0:1]" :key="line.playerId"><th>{{ roster.find(p=>p.id===line.playerId)?.firstName }} {{ roster.find(p=>p.id===line.playerId)?.lastName }}</th><td>{{ line.points }}</td><td>{{ line.rebounds }}</td><td>{{ line.assists }}</td><td>{{ line.steals }}</td><td>{{ line.blocks }}</td></tr></tbody></table></div></section>
    <div class="teams">
      <section class="team"><h2>Votre effectif · {{ selected.length }}/3 titulaires</h2><p class="hint">Décochez un titulaire pour libérer sa place. Aucun poste imposé : testez les associations.</p>
        <article v-for="player in roster" :key="player.id"><div class="player-title"><h3>{{ player.firstName }} {{ player.lastName }}</h3><label class="selection"><input type="checkbox" :checked="selected.includes(player.id)" :disabled="!selected.includes(player.id)&&selected.length===3" @change="toggle(player.id)" />Titulaire</label></div><p class="hint">{{ 1983-player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Potentiel {{ player.potential }}</p><div class="strengths"><span v-for="([key,value]) in Object.entries(player.attributes).filter(([key])=>!['freeThrows','midRange','iq','vertical'].includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,3)" :key="key">{{ attributeLabels[key as keyof typeof attributeLabels] }} <b>{{ value }}</b></span></div><details><summary>Caractéristiques complètes</summary><dl><div v-for="(label,key) in attributeLabels" :key="key"><dt>{{ label }}</dt><dd>{{ player.attributes[key] }}</dd></div></dl></details></article>
      </section>
      <section class="team"><h2>{{ tournament?'Classement du tournoi':'Coupe du quartier' }}</h2><template v-if="!tournament"><p>Quatre équipes, trois rencontres chacune. Premier à 21, paniers à 1 et 2 points.</p><p>Récompenses : 300 F au champion, 200 F au deuxième, 125 F au troisième et 75 F au quatrième.</p><p class="hint">Les francs sont une ressource de jeu ; les montants ne sont pas une reconstitution historique.</p></template><template v-else><div class="table-wrap"><table><caption>Départage : victoires, différence de points, points marqués, identifiant stable.</caption><thead><tr><th>Équipe</th><th>V</th><th>Diff.</th></tr></thead><tbody><tr v-for="(line,i) in tournament.standings" :key="line.teamId"><th>{{ i+1 }}. {{ line.name }}</th><td>{{ line.wins }}</td><td>{{ line.scored-line.conceded }}</td></tr></tbody></table></div><h3 class="history-title">Résultats du tournoi</h3><p v-for="match in tournament.matches" :key="`${match.round}-${match.home}`" class="hint">{{ teamName(match.home) }} {{ match.result.scores[0] }}–{{ match.result.scores[1] }} {{ teamName(match.away) }}</p></template></section>
    </div>
    <footer>Prototype 002 · Pas encore de sauvegarde : recharger la page remet la session à zéro. Scouting et recrutement arrivent ensuite.</footer>
  </main>
</template>
