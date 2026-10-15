<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { startTraining, train, trainingCost, trainingLabels, type Training, type TrainingFocus } from './game/training'
import { afterPlaying, recover } from './game/fitness'
import { advanceCalendar, afterMatch, createCalendar, dateLabel, nextEvent, scheduleScouting, scheduleTournament, yearAt } from './game/calendar'
import { decodeSave, saveKey, type Save } from './game/save'
import Laboratory from './Laboratory.vue'
import { attributeLabels, tactics, type Tactic } from './game/model'
import { createScouting, launchScouting, revealNext, closeCampaign, recruit, recruitmentCost, scoutingCost } from './game/scouting'
import { createRoster, playRound, startTournament, type Tournament } from './game/tournament'
const training=shallowRef<Training|null>(null), trainingPlayer=ref('player-0'), trainingFocus=ref<TrainingFocus>('shooting'), trainingReport=ref('')
function camp() {
 try {const next=startTraining(roster.value,money.value,trainingPlayer.value,trainingFocus.value,calendar.value.day,training.value);training.value=next.training;money.value=next.money;calendar.value={...calendar.value,trainingDay:next.training.day};trainingReport.value='';error.value=''} catch(e) {error.value=(e as Error).message}
}
const calendar=shallowRef(createCalendar())
const upcoming=computed(()=>nextEvent(calendar.value))
const currentYear=computed(()=>yearAt(calendar.value.day))
function advance() {
 try {
  const next=advanceCalendar(calendar.value), days=next.day-calendar.value.day
  roster.value=recover(roster.value,days)
  if(tournament.value) tournament.value={...tournament.value,teams:tournament.value.teams.map(t=>({...t,players:recover(t.players,days)}))}
  if(training.value && training.value.day<=next.day) {
   const job=training.value, player=roster.value.find(p=>p.id===job.playerId)!
   const result=train(player,job.focus);roster.value=roster.value.map(p=>p.id===player.id?result.player:p)
   trainingReport.value=`${player.firstName} ${player.lastName} : ${result.gains.map(g=>`${attributeLabels[g.attribute]} +${g.amount}`).join(', ') || 'aucune progression disponible'}.`
   training.value=null
  }
  calendar.value=next;error.value=''
 } catch(e) {error.value=(e as Error).message}
}
const scouting = shallowRef(createScouting(1983))
const prospects = computed(()=>scouting.value.pool.filter(p=>scouting.value.known.includes(p.id)))
const screen = ref<'team'|'tournament'|'scouting'|'training'|'lab'>('team')
const lab = computed(()=>screen.value==='lab')
const name = ref('Les Aurores'), roster = shallowRef(createRoster(1983))
const selected = ref(roster.value.slice(0,3).map(p=>p.id)), tactic = ref<Tactic>('balanced')
const tournament = shallowRef<Tournament | null>(null), money=ref(0), titles=ref(0), edition=ref(0), error=ref('')
const saveStatus = ref('Sauvegarde automatique active')
let canSave = true
try {
 const raw=localStorage.getItem(saveKey)
 if(raw) {
  const loaded=decodeSave(raw)
  training.value=loaded.training;calendar.value=loaded.calendar;name.value=loaded.name;roster.value=loaded.roster;selected.value=loaded.selected;tactic.value=loaded.tactic
  tournament.value=loaded.tournament;money.value=loaded.money;titles.value=loaded.titles;edition.value=loaded.edition;scouting.value=loaded.scouting
  saveStatus.value='Partie reprise'
 }
} catch(e) {canSave=false;saveStatus.value=`Reprise impossible : ${(e as Error).message} Votre sauvegarde est conservée.`}
function snapshot(): Save {return {version:1,training:training.value,calendar:calendar.value,name:name.value,roster:roster.value,selected:selected.value,tactic:tactic.value,tournament:tournament.value,money:money.value,titles:titles.value,edition:edition.value,scouting:scouting.value}}
watch(snapshot,()=>{
 if(!canSave) return
 try {localStorage.setItem(saveKey,JSON.stringify(snapshot()));saveStatus.value='Partie sauvegardée'}
 catch {saveStatus.value='Sauvegarde indisponible. Votre partie reste jouable pendant cette session.'}
},{deep:true,flush:'post'})
function newGame() {
 if(!window.confirm('Effacer votre partie sauvegardée et recommencer ?')) return
 try {localStorage.removeItem(saveKey)} catch {saveStatus.value='Impossible d’effacer la sauvegarde.';return}
 canSave=true;training.value=null;trainingReport.value='';calendar.value=createCalendar();name.value='Les Aurores';roster.value=createRoster(1983);selected.value=roster.value.slice(0,3).map(p=>p.id)
 tactic.value='balanced';tournament.value=null;money.value=0;titles.value=0;edition.value=0;scouting.value=createScouting(1983);screen.value='team';error.value=''
}
const lastMatch=computed(()=>tournament.value?.matches.filter(m=>m.home==='club'||m.away==='club').at(-1))
const opponent=computed(()=>tournament.value && !tournament.value.finished ? tournament.value.teams[tournament.value.round+1] : null)
function toggle(id:string) { selected.value=selected.value.includes(id)?selected.value.filter(x=>x!==id):selected.value.length<3?[...selected.value,id]:selected.value }
function start() {
 try { const planned=scheduleTournament(calendar.value);tournament.value=startTournament(1983+edition.value,roster.value,selected.value,name.value);calendar.value=planned;edition.value++;screen.value='tournament';error.value='' }
 catch(e) {error.value=(e as Error).message}
}
function play() {
 try {
  if(calendar.value.matchDay===null || calendar.value.matchDay>calendar.value.day) throw Error('Avancez jusqu’à la date du match.')
  const next=playRound(tournament.value!,roster.value,selected.value,tactic.value)
  calendar.value=afterMatch(calendar.value,next.finished)
  tournament.value=next
  roster.value=afterPlaying(roster.value,selected.value)
  if(next.finished) {money.value+=next.reward;if(next.rank===1)titles.value++}
  error.value=''
 } catch(e) {error.value=(e as Error).message}
}
function campaign() {
 try {const planned=scheduleScouting(calendar.value);const next=launchScouting(scouting.value,money.value);scouting.value=next.state;calendar.value=planned;money.value=next.money;error.value=''}
 catch(e) {error.value=(e as Error).message}
}
function reveal() { if(calendar.value.scoutingDay===null) scouting.value=revealNext(scouting.value) }
function finishCampaign() { scouting.value=closeCampaign(scouting.value) }
function hire(id:string) {
 try {const next=recruit(scouting.value,roster.value,money.value,id);roster.value=next.roster;money.value=next.money;error.value=''}
 catch(e) {error.value=(e as Error).message}
}
function teamName(id:string) {return tournament.value?.teams.find(t=>t.id===id)?.name}
</script>
<template>
  <nav class="mode-nav" aria-label="Sections du jeu"><button @click="screen='team'" :aria-pressed="screen==='team'">Mon équipe</button><button @click="screen='tournament'" :aria-pressed="screen==='tournament'">Tournoi</button><button @click="screen='scouting'" :aria-pressed="screen==='scouting'">Scouting</button><button @click="screen='training'" :aria-pressed="screen==='training'">Entraînement</button><button @click="screen='lab'" :aria-pressed="screen==='lab'">Laboratoire</button></nav>
  <Laboratory v-if="lab" />
  <main v-else>
    <header><div><p class="eyebrow">France · {{ dateLabel(calendar.day) }} · Circuit local</p><h1>{{ screen==='team' ? 'Votre équipe' : screen==='tournament' ? 'Coupe du quartier' : screen==='training' ? 'Développer vos joueurs' : 'Votre réseau de scouting' }}</h1></div><span class="tag">{{ money }} F · {{ titles }} titre{{ titles > 1 ? 's' : '' }}</span></header>
    <p>{{ screen==='team' ? 'Choisissez trois titulaires parmi vos joueurs, puis inscrivez votre équipe au tournoi.' : screen==='tournament' ? 'Trois rencontres pour décrocher le titre et financer vos prochains recrutements.' : screen==='training' ? 'Investissez dans un camp individuel pour améliorer durablement un joueur.' : 'Découvrez des profils, comparez leurs qualités et renforcez votre équipe.' }}</p>
    <section class="event-bar" aria-label="Prochain événement"><div><p class="eyebrow">Calendrier</p><p v-if="upcoming">{{ upcoming.label }} · {{ dateLabel(upcoming.day) }}</p><p v-else-if="calendar.matchDay!==null">Votre match est prêt à être joué.</p><p v-else>Inscrivez votre équipe à un tournoi ou lancez une campagne de scouting.</p></div><button v-if="upcoming" @click="advance">Avancer au prochain événement</button><button v-else-if="calendar.matchDay!==null && screen!=='tournament'" @click="screen='tournament'">Rejoindre le tournoi</button></section>
    <div v-if="screen==='team' || screen==='tournament'" class="toolbar"><label>Nom de votre équipe<input v-model="name" :disabled="!!tournament && !tournament.finished" maxlength="40" /></label><label>Tactique<select v-model="tactic"><option v-for="(label,key) in tactics" :value="key" :key="key">{{ label }}</option></select></label><button v-if="!tournament || tournament.finished" class="primary" :disabled="selected.length!==3" @click="start">{{ tournament ? 'Participer au prochain tournoi' : 'Inscrire mon équipe' }}</button></div>
    <div class="save-bar"><p role="status">{{ saveStatus }}</p><button @click="newGame">Nouvelle partie</button></div>
    <p v-if="error" role="alert">{{ error }}</p>
    <section v-if="screen==='tournament' && tournament" class="result">
      <p class="eyebrow">Coupe du quartier · Édition {{ edition }}</p>
      <template v-if="!tournament.finished"><h2>Match {{ tournament.round+1 }} sur 3 · {{ opponent?.name }}</h2><p>Chaque équipe affronte les trois autres. Vous pouvez changer vos titulaires et votre tactique entre les matchs.</p><button class="primary" :disabled="selected.length!==3 || calendar.matchDay===null || calendar.matchDay>calendar.day" @click="play">Jouer le prochain match</button></template>
      <template v-else><h2>{{ tournament.rank===1 ? 'Champions du quartier !' : `Tournoi terminé : ${tournament.rank}e place` }}</h2><p>{{ tournament.reward }} F gagnés. {{ tournament.rank===1 ? 'Un premier titre pour votre équipe.' : 'Essayez une autre composition au prochain tournoi.' }}</p><p class="hint">Investissez vos gains dans le scouting pour découvrir et recruter de nouveaux joueurs.</p></template>
    </section>
    <section v-if="screen==='tournament' && lastMatch" class="result" aria-live="polite"><p class="eyebrow">Dernier match</p><h2>{{ teamName(lastMatch.home) }} <strong>{{ lastMatch.result.scores[0] }} — {{ lastMatch.result.scores[1] }}</strong> {{ teamName(lastMatch.away) }}</h2><p>{{ lastMatch.result.winner==='club'?'Victoire !':'Défaite.' }}</p><div class="table-wrap"><table><caption>Vos joueurs lors de ce match</caption><thead><tr><th>Joueur</th><th>PTS</th><th>REB</th><th>PD</th><th>INT</th><th>CTR</th></tr></thead><tbody><tr v-for="line in lastMatch.result.stats[lastMatch.home==='club'?0:1]" :key="line.playerId"><th>{{ roster.find(p=>p.id===line.playerId)?.firstName }} {{ roster.find(p=>p.id===line.playerId)?.lastName }}</th><td>{{ line.points }}</td><td>{{ line.rebounds }}</td><td>{{ line.assists }}</td><td>{{ line.steals }}</td><td>{{ line.blocks }}</td></tr></tbody></table></div></section>
    <section v-if="screen==='training'" class="team">
      <h2>Camp individuel · {{ trainingCost }} F</h2><p>Sept jours de travail sur deux caractéristiques. Gain maximum : un point par caractéristique, dans les limites du potentiel et de la note 99. Le camp ajoute huit points de fatigue à son retour.</p>
      <p v-if="training">{{ roster.find(p=>p.id===training!.playerId)?.firstName }} {{ roster.find(p=>p.id===training!.playerId)?.lastName }} travaille sur {{ trainingLabels[training.focus] }} jusqu’au {{ dateLabel(training.day) }}.</p>
      <div v-else class="toolbar"><label>Joueur<select v-model="trainingPlayer"><option v-for="player in roster" :key="player.id" :value="player.id">{{ player.firstName }} {{ player.lastName }}</option></select></label><label>Axe de travail<select v-model="trainingFocus"><option v-for="(label,key) in trainingLabels" :key="key" :value="key">{{ label }}</option></select></label><button :disabled="money<trainingCost" @click="camp">Financer le camp · 100 F</button></div>
      <p v-if="trainingReport" role="status">{{ trainingReport }}</p><p class="hint">Les matchs restent accessibles pendant le camp dans ce prototype. Un seul camp à la fois ; les blessures et le staff restent à développer.</p>
    </section>
    <section v-if="screen==='scouting'" class="scouting-panel" aria-labelledby="scouting-title">
      <div class="team-head"><div><p class="eyebrow">Réseau local</p><h2 id="scouting-title">Campagne de scouting</h2></div><span class="tag">{{ prospects.length }}/30 prospects observés</span></div>
      <p>Envoyez un observateur sur les playgrounds : {{ scoutingCost }} F pour jusqu’à trois dossiers. Découvrir un joueur ne le recrute pas automatiquement.</p>
      <button v-if="!scouting.campaign" :disabled="money<scoutingCost || prospects.length===30" @click="campaign">Lancer un scouting · 50 F</button>
      <p v-else-if="calendar.scoutingDay!==null" class="scouting-pending">Votre observateur revient le {{ dateLabel(calendar.scoutingDay) }}. Avancez au prochain événement pour recevoir ses dossiers.</p>
      <div v-else class="reveal-zone" aria-live="polite"><p>{{ scouting.revealed }}/{{ scouting.campaign.length }} dossiers révélés</p><button v-if="scouting.revealed<scouting.campaign.length" class="primary" @click="reveal">Révéler le prochain dossier</button><button v-else @click="finishCampaign">Terminer la campagne</button><div class="prospect-grid"><article v-for="id in scouting.campaign.slice(0,scouting.revealed)" :key="id" class="prospect-card"><p class="eyebrow">Nouveau prospect</p><h3>{{ scouting.pool.find(p=>p.id===id)?.firstName }} {{ scouting.pool.find(p=>p.id===id)?.lastName }}</h3><p>Potentiel {{ scouting.pool.find(p=>p.id===id)?.potential }} · {{ scouting.pool.find(p=>p.id===id)?.height }} cm</p></article></div></div>
      <details v-if="prospects.length" :open="!scouting.campaign"><summary>Les joueurs observés</summary><div class="prospect-grid"><article v-for="player in prospects" :key="player.id" class="prospect-card"><h3>{{ player.firstName }} {{ player.lastName }}</h3><p class="hint">{{ currentYear-player.birthYear }} ans · {{ player.height }} cm · Potentiel {{ player.potential }}</p><div class="strengths"><span v-for="([key,value]) in Object.entries(player.attributes).filter(([key])=>!['freeThrows','midRange','iq','vertical'].includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,3)" :key="key">{{ attributeLabels[key as keyof typeof attributeLabels] }} <b>{{ value }}</b></span></div><p class="fitness">Fatigue {{ player.fatigue }}/100 <meter min="0" max="100" low="35" high="65" optimum="0" :value="player.fatigue">{{ player.fatigue }}</meter></p><details><summary>Caractéristiques complètes</summary><dl><div v-for="(label,key) in attributeLabels" :key="key"><dt>{{ label }}</dt><dd>{{ player.attributes[key] }}</dd></div></dl></details><p class="hint">Rapport complet pour ce prototype.</p><button :disabled="roster.some(p=>p.id===player.id)||money<recruitmentCost(player)||roster.length>=10" @click="hire(player.id)">{{ roster.some(p=>p.id===player.id)?'Dans votre équipe':`Recruter · ${recruitmentCost(player)} F` }}</button></article></div></details>
      <p class="hint">Effectif : {{ roster.length }}/10. Une campagne prend sept jours dans le jeu. Les dossiers restent disponibles après leur révélation.</p>
    </section>
    <div v-if="screen==='team' || screen==='tournament'" class="section-content">
      <section v-if="screen==='team'" class="team"><h2>Votre effectif · {{ selected.length }}/3 titulaires</h2><p class="hint">Décochez un titulaire pour libérer sa place. Aucun poste imposé : testez les associations. Les titulaires se fatiguent ; tous les joueurs récupèrent six points par jour. Au-delà de 20, la fatigue réduit leurs performances.</p>
        <article v-for="player in roster" :key="player.id"><div class="player-title"><h3>{{ player.firstName }} {{ player.lastName }}</h3><label class="selection"><input type="checkbox" :checked="selected.includes(player.id)" :disabled="!selected.includes(player.id)&&selected.length===3" @change="toggle(player.id)" />Titulaire</label></div><p class="hint">{{ currentYear-player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Potentiel {{ player.potential }}</p><div class="strengths"><span v-for="([key,value]) in Object.entries(player.attributes).filter(([key])=>!['freeThrows','midRange','iq','vertical'].includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,3)" :key="key">{{ attributeLabels[key as keyof typeof attributeLabels] }} <b>{{ value }}</b></span></div><p class="fitness">Fatigue {{ player.fatigue }}/100 <meter min="0" max="100" low="35" high="65" optimum="0" :value="player.fatigue">{{ player.fatigue }}</meter></p><details><summary>Caractéristiques complètes</summary><dl><div v-for="(label,key) in attributeLabels" :key="key"><dt>{{ label }}</dt><dd>{{ player.attributes[key] }}</dd></div></dl></details></article>
      </section>
      <section v-if="screen==='tournament'" class="team"><h2>{{ tournament?'Classement du tournoi':'Coupe du quartier' }}</h2><template v-if="!tournament"><p>Quatre équipes, trois rencontres chacune. Premier à 21, paniers à 1 et 2 points.</p><p>Récompenses : 300 F au champion, 200 F au deuxième, 125 F au troisième et 75 F au quatrième.</p><p class="hint">Les francs sont une ressource de jeu ; les montants ne sont pas une reconstitution historique.</p></template><template v-else><div class="table-wrap"><table><caption>Départage : victoires, différence de points, points marqués, identifiant stable.</caption><thead><tr><th>Équipe</th><th>V</th><th>Diff.</th></tr></thead><tbody><tr v-for="(line,i) in tournament.standings" :key="line.teamId"><th>{{ i+1 }}. {{ line.name }}</th><td>{{ line.wins }}</td><td>{{ line.scored-line.conceded }}</td></tr></tbody></table></div><h3 class="history-title">Résultats du tournoi</h3><p v-for="match in tournament.matches" :key="`${match.round}-${match.home}`" class="hint">{{ teamName(match.home) }} {{ match.result.scores[0] }}–{{ match.result.scores[1] }} {{ teamName(match.away) }}</p></template></section>
    </div>
    <footer>Prototype 008 · Sauvegarde locale automatique dans ce navigateur. Le temps avance d’événement en événement. Fatigue et récupération sont actives. Camps individuels disponibles. La progression en match et le circuit de compétitions arrivent ensuite.</footer>
  </main>
</template>
