<script setup lang="ts">
import GameMenu from './GameMenu.vue'
import ClubHub from './ClubHub.vue'
import FoundingScreen from './FoundingScreen.vue'
import TeamLineup from './TeamLineup.vue'
import { lineupFromSelected, selectedFromLineup, type Lineup } from './game/lineup'
import { createFounding, foundClub, type Founding } from './game/founding'
import GameDialog from './GameDialog.vue'
import Pager from './Pager.vue'
import ScoutBoard from './ScoutBoard.vue'
import CircuitBoard from './CircuitBoard.vue'
import MatchPreview from './MatchPreview.vue'
import MatchReport from './MatchReport.vue'
import { circuits, createCareer, enterCircuit, finishCircuit, type CircuitId } from './game/circuit'
import { computed, ref, shallowRef, watch } from 'vue'
import { startTraining, train, trainingCost, trainingLabels, type Training, type TrainingFocus } from './game/training'
import { afterPlaying, recover } from './game/fitness'
import { advanceCalendar, afterMatch, createCalendar, dateLabel, nextEvent, scheduleScouting, scheduleTournament, yearAt } from './game/calendar'
import { decodeSave, saveKey, type Save } from './game/save'
import Laboratory from './Laboratory.vue'
import { attributeLabels, tactics, type Tactic } from './game/model'
import { createScouting, launchScouting, revealNext, closeCampaign, recruit } from './game/scouting'
import { createRoster, playRound, type Tournament } from './game/tournament'
const route=ref<'menu'|'career'>('menu'),hasSave=ref(false),reduceMotion=ref(false)
try {reduceMotion.value=localStorage.getItem('courtside.reduceMotion')==='true'}catch {}
watch(reduceMotion,value=>{document.documentElement.dataset.reduceMotion=String(value);try{localStorage.setItem('courtside.reduceMotion',String(value))}catch{}},{immediate:true})
const founding=shallowRef<Founding>(createFounding())
const career=shallowRef(createCareer()), chosenCircuit=ref<CircuitId>('neighborhood')
const currentCircuit=computed(()=>career.value.active ?? career.value.history.at(-1)?.circuit ?? chosenCircuit.value)
const lastCompetition=computed(()=>career.value.history.find(result=>result.edition===edition.value))
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
  calendar.value=next;if(screen.value==='tournament'&&next.matchDay!==null&&next.matchDay<=next.day)tournamentTab.value='preview';error.value=''
 } catch(e) {error.value=(e as Error).message}
}
const scouting = shallowRef(createScouting(1983))
const screen = ref<'club'|'team'|'tournament'|'scouting'|'training'|'circuit'|'lab'>('club')
watch([route,screen,()=>founding.value.completed],()=>window.scrollTo(0,0),{flush:'post'})
const name = ref('Les Aurores'), roster = shallowRef(createRoster(1983))
const selected = ref(roster.value.slice(0,3).map(p=>p.id)), tactic = ref<Tactic>('balanced')
const lineup=ref<Lineup>(lineupFromSelected(selected.value))
function compose(value:Lineup){lineup.value=value;selected.value=selectedFromLineup(value);error.value=''}
const tournament = shallowRef<Tournament | null>(null), money=ref(0), titles=ref(0), edition=ref(0), error=ref('')
const saveStatus = ref('Sauvegarde automatique active')
let canSave = true
try {
 const raw=localStorage.getItem(saveKey)
 if(raw) {
  hasSave.value=true;
  const loaded=decodeSave(raw)
  founding.value=loaded.founding;trainingPlayer.value=loaded.roster[0]!.id;career.value=loaded.career;training.value=loaded.training;calendar.value=loaded.calendar;name.value=loaded.name;roster.value=loaded.roster;selected.value=loaded.selected;lineup.value=loaded.lineup??lineupFromSelected(loaded.selected);tactic.value=loaded.tactic
  tournament.value=loaded.tournament;money.value=loaded.money;titles.value=loaded.titles;edition.value=loaded.edition;scouting.value=loaded.scouting
  saveStatus.value='Partie reprise'
 }
} catch(e) {canSave=false;saveStatus.value=`Reprise impossible : ${(e as Error).message} Votre sauvegarde est conservée.`}
function snapshot(): Save {return {version:1,founding:founding.value,career:career.value,training:training.value,calendar:calendar.value,name:name.value,roster:roster.value,selected:selected.value,lineup:lineup.value,tactic:tactic.value,tournament:tournament.value,money:money.value,titles:titles.value,edition:edition.value,scouting:scouting.value}}
watch(snapshot,()=>{
 if(!canSave) return
 try {localStorage.setItem(saveKey,JSON.stringify(snapshot()));hasSave.value=true;saveStatus.value='Partie sauvegardée'}
 catch {saveStatus.value='Sauvegarde indisponible. Votre partie reste jouable pendant cette session.'}
},{deep:true,flush:'post'})
function newGame() {
 if(hasSave.value&&!window.confirm('Effacer votre partie sauvegardée et recommencer ?')) return
 try {localStorage.removeItem(saveKey)} catch {saveStatus.value='Impossible d’effacer la sauvegarde.';return}
 route.value='career';hasSave.value=false;canSave=true;founding.value=createFounding();trainingPlayer.value='player-0';career.value=createCareer();chosenCircuit.value='neighborhood';training.value=null;trainingReport.value='';calendar.value=createCalendar();name.value='Les Aurores';roster.value=createRoster(1983);selected.value=roster.value.slice(0,3).map(p=>p.id);lineup.value=lineupFromSelected(selected.value)
 tactic.value='balanced';tournament.value=null;money.value=0;titles.value=0;edition.value=0;scouting.value=createScouting(1983);screen.value='club';error.value=''
}
const lastMatch=computed(()=>tournament.value?.matches.filter(m=>m.home==='club'||m.away==='club').at(-1))
const selectedTeam=computed(()=>selected.value.length===3 ? {id:'club',name:name.value,players:selected.value.map(id=>roster.value.find(player=>player.id===id)!)} : null)
const opponent=computed(()=>tournament.value && !tournament.value.finished ? tournament.value.teams[tournament.value.round+1] : null)
function start() {
 try { const planned=scheduleTournament(calendar.value);const entered=enterCircuit(career.value,chosenCircuit.value,1983+edition.value,roster.value,selected.value,name.value);tournament.value=entered.tournament;career.value=entered.career;calendar.value=planned;edition.value++;screen.value='tournament';error.value='' }
 catch(e) {error.value=(e as Error).message}
}
function play() {
 try {
  if(calendar.value.matchDay===null || calendar.value.matchDay>calendar.value.day) throw Error('Avancez jusqu’à la date du match.')
  const next=playRound(tournament.value!,roster.value,selected.value,tactic.value)
  calendar.value=afterMatch(calendar.value,next.finished)
  tournament.value=next
  roster.value=afterPlaying(roster.value,selected.value)
  if(next.finished) {const completed=finishCircuit(career.value,next,edition.value,calendar.value.day);career.value=completed.career;money.value+=completed.result.reward;if(next.rank===1)titles.value++}
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
function pickFounder(id:string) {
 if(founding.value.revealed.length!==12)return
 const ids=founding.value.selected
 founding.value={...founding.value,completed:false,selected:ids.includes(id)?ids.filter(value=>value!==id):ids.length<6?[...ids,id]:ids}
 error.value=''
}
function confirmFounding() {
 try {
  if(founding.value.revealed.length!==12)throw Error('Dévoilez les douze joueurs avant de composer votre effectif.')
  const club=foundClub(name.value,founding.value.selected,founding.value.generation)
  name.value=club.name;roster.value=club.roster;selected.value=club.selected;lineup.value=lineupFromSelected(club.selected);trainingPlayer.value=club.roster[0]!.id
  founding.value=club.founding;screen.value='club';error.value=''
 } catch(e) {error.value=(e as Error).message}
}
function resume() {route.value='career';screen.value='club'}
function teamName(id:string) {return tournament.value?.teams.find(t=>t.id===id)?.name}
const preparation=ref<InstanceType<typeof GameDialog>|null>(null),report=ref<InstanceType<typeof GameDialog>|null>(null),trainingHelp=ref<InstanceType<typeof GameDialog>|null>(null)
const allResults=ref<InstanceType<typeof GameDialog>|null>(null),resultRound=ref(0)
const tournamentTab=ref<'preview'|'match'|'standings'>('preview')
const sections=[{id:'club',label:'Le club'},{id:'team',label:'Mon équipe'},{id:'tournament',label:'Tournoi'},{id:'scouting',label:'Scouting'},{id:'training',label:'Entraînement'},{id:'circuit',label:'Circuit'},{id:'lab',label:'Laboratoire'}] as const
const viewTitle=computed(()=>screen.value==='team'?'Votre équipe':screen.value==='tournament'?circuits[currentCircuit.value].name:screen.value==='training'?'Entraînement':screen.value==='scouting'?'Scouting':screen.value==='circuit'?'Votre parcours':screen.value==='lab'?'Laboratoire':'Le club')
watch(lastMatch,()=>{if(lastMatch.value)tournamentTab.value='match'})
watch(tournament,()=>{if(tournament.value?.round===0)tournamentTab.value='preview'})
function joinMatch(){screen.value='tournament';play()}
</script>
<template>
<GameMenu v-if="route==='menu'" :has-save="hasSave" :can-continue="canSave" :club-name="name" :completed="founding.completed" v-model:reduce-motion="reduceMotion" :save-status="saveStatus" @start="newGame" @resume="resume" />
<FoundingScreen v-else-if="!founding.completed" v-model:name="name" v-model:founding="founding" :save-status="saveStatus" :error="error" @pick="pickFounder" @confirm="confirmFounding" @restart="newGame" @menu="route='menu'" />
<div v-else class="game-shell fixed-game">
<aside class="game-rail"><div class="brand">◉ COURTSIDE<span class="brand-edition">1983</span></div><nav class="mode-nav" aria-label="Sections du jeu"><button v-for="section in sections" :key="section.id" :aria-pressed="screen===section.id" @click="screen=section.id">{{ section.label }}</button><button @click="route='menu'">Menu principal</button></nav><p class="rail-footer">DU BITUME AUX SOMMETS</p></aside>
<div class="game-content"><header class="game-topbar"><div><p class="eyebrow">{{ name }} · {{ dateLabel(calendar.day) }}</p><h1>{{ viewTitle }}</h1></div><div class="club-wallet"><span><small>TRÉSORERIE</small><b>{{ money }} F</b></span><span><small>RÉPUTATION</small><b>{{ career.reputation }}</b></span><span><small>TITRES</small><b>{{ titles }}</b></span></div><span class="save-indicator" role="status">{{ saveStatus }}</span></header>
<p v-if="error" class="game-error" role="alert">{{ error }}</p>
<main class="game-stage" :class="`screen-${screen}`">
<ClubHub v-if="screen==='club'" :name="name" :date="dateLabel(calendar.day)" :money="money" :reputation="career.reputation" :titles="titles" :count="roster.length" :event-label="upcoming?.label??null" :event-date="upcoming?dateLabel(upcoming.day):null" :match-ready="calendar.matchDay!==null&&calendar.matchDay<=calendar.day" :active-tournament="!!tournament&&!tournament.finished" :has-played="edition>0" :save-status="saveStatus" @visit="screen=$event" @advance="advance" />
<TeamLineup v-else-if="screen==='team'" :roster="roster" :lineup="lineup" :year="currentYear" :name="name" @update:lineup="compose" />
<section v-else-if="screen==='tournament'" class="tournament-board screen-panel">
<div class="game-tabs"><button :aria-pressed="tournamentTab==='preview'" @click="tournamentTab='preview'">Préparer</button><button :aria-pressed="tournamentTab==='match'" @click="tournamentTab='match'">Dernier match</button><button :aria-pressed="tournamentTab==='standings'" @click="tournamentTab='standings'">Classement</button></div>
<div v-if="tournament" class="tournament-status"><span>Édition {{ edition }} · {{ tournament.finished?'Terminé':`Match ${tournament.round+1}/3` }}</span><strong v-if="tournament.finished">{{ tournament.rank===1?'Compétition remportée !':`${tournament.rank}e place` }} · {{ lastCompetition?.reward??tournament.reward }} F</strong></div>
<template v-if="tournamentTab==='preview'"><MatchPreview v-if="opponent" :club="selectedTeam" :opponent="opponent" :tactic="tactic" /><div v-else class="mission-brief"><p class="eyebrow">{{ tournament?.finished?'LE PROCHAIN DÉFI':'STREETBALL / 3 CONTRE 3' }}</p><h2>{{ tournament?.finished?'Une nouvelle étape t’attend.':circuits[chosenCircuit].name }}</h2><p>Quatre équipes. Trois matchs. Premier à 21 points.</p><p v-if="tournament?.finished">Consulte le dernier match ou le classement, puis prépare ta prochaine compétition.</p><p v-else>Dotation : {{ 300*circuits[chosenCircuit].multiplier }} / {{ 200*circuits[chosenCircuit].multiplier }} / {{ 125*circuits[chosenCircuit].multiplier }} / {{ 75*circuits[chosenCircuit].multiplier }} F.</p></div></template>
<template v-else-if="tournamentTab==='match'"><div v-if="lastMatch" class="last-match-view"><p class="eyebrow">{{ lastMatch.result.winner==='club'?'VICTOIRE':'DÉFAITE' }}</p><div class="match-score"><span>{{ teamName(lastMatch.home) }}</span><strong>{{ lastMatch.result.scores[0] }} — {{ lastMatch.result.scores[1] }}</strong><span>{{ teamName(lastMatch.away) }}</span></div><div class="table-wrap"><table><caption>Vos joueurs lors de ce match</caption><thead><tr><th>Joueur</th><th>PTS</th><th>REB</th><th>PD</th><th>INT</th><th>CTR</th></tr></thead><tbody><tr v-for="line in lastMatch.result.stats[lastMatch.home==='club'?0:1]" :key="line.playerId"><th>{{ roster.find(p=>p.id===line.playerId)?.firstName }} {{ roster.find(p=>p.id===line.playerId)?.lastName }}</th><td>{{ line.points }}</td><td>{{ line.rebounds }}</td><td>{{ line.assists }}</td><td>{{ line.steals }}</td><td>{{ line.blocks }}</td></tr></tbody></table></div><button @click="report?.open()">Bilan détaillé du match ↗</button></div><p v-else class="empty-state">Ton premier match reste à jouer.</p></template>
<template v-else><template v-if="tournament"><table class="standings-table"><caption>Classement · victoires, différence de points</caption><thead><tr><th>Équipe</th><th>V</th><th>Diff.</th></tr></thead><tbody><tr v-for="(line,index) in tournament.standings" :key="line.teamId"><th>{{ index+1 }}. {{ line.name }}</th><td>{{ line.wins }}</td><td>{{ line.scored-line.conceded }}</td></tr></tbody></table><button @click="allResults?.open()">Tous les résultats ↗</button></template><p v-else class="empty-state">Inscris ton équipe pour découvrir le tableau.</p></template>
</section>
<ScoutBoard v-else-if="screen==='scouting'" :state="scouting" :roster="roster" :money="money" :year="currentYear" :return-date="calendar.scoutingDay!==null?dateLabel(calendar.scoutingDay):null" @launch="campaign" @reveal="reveal" @finish="finishCampaign" @hire="hire" />
<CircuitBoard v-else-if="screen==='circuit'" :career="career" @choose="chosenCircuit=$event;screen='team'" />
<section v-else-if="screen==='training'" class="screen-panel training-board"><div class="panel-controls"><p class="eyebrow">CAMP INDIVIDUEL / 7 JOURS</p><button @click="trainingHelp?.open()">Comment ça marche ?</button></div><h2>Le travail paie.</h2><p v-if="training" class="training-pending">{{ roster.find(p=>p.id===training!.playerId)?.firstName }} {{ roster.find(p=>p.id===training!.playerId)?.lastName }} travaille sur {{ trainingLabels[training.focus] }} jusqu’au {{ dateLabel(training.day) }}.</p><div v-else class="training-form"><label>Joueur<select v-model="trainingPlayer"><option v-for="player in roster" :key="player.id" :value="player.id">{{ player.firstName }} {{ player.lastName }} · {{ currentYear-player.birthYear }} ans · potentiel {{ player.potential }}</option></select></label><label>Axe de travail<select v-model="trainingFocus"><option v-for="(label,key) in trainingLabels" :key="key" :value="key">{{ label }}</option></select></label><p>Deux caractéristiques travaillées. +1 point maximum sur chacune, dans la limite du potentiel.</p><button class="primary" :disabled="money<trainingCost" @click="camp">Financer le camp · 100 F</button></div><p v-if="trainingReport" role="status">{{ trainingReport }}</p></section>
<Laboratory v-else />
</main>
<footer v-if="screen!=='lab'" class="game-actionbar"><div><small>{{ upcoming?'PROCHAIN ÉVÉNEMENT':calendar.matchDay!==null?'MATCH PRÊT':'LE PROCHAIN DÉFI' }}</small><strong>{{ upcoming?`${upcoming.label} · ${dateLabel(upcoming.day)}`:calendar.matchDay!==null?'Le terrain t’attend.':circuits[chosenCircuit].name }}</strong></div><button v-if="screen==='team'||screen==='tournament'" class="prepare-button" @click="preparation?.open()">Tactique · {{ tactics[tactic] }} ⚙</button><button v-if="upcoming" class="primary" @click="advance">Avancer au prochain événement</button><button v-else-if="calendar.matchDay!==null" class="primary" :disabled="selected.length!==3" @click="joinMatch">Jouer le prochain match</button><button v-else-if="screen==='team'||screen==='tournament'" class="primary" :disabled="selected.length!==3" @click="start">{{ tournament?'Participer au prochain tournoi':'Inscrire mon équipe' }}</button><button v-else class="primary" @click="screen='team'">Préparer mon équipe ↗</button></footer>
</div>
<GameDialog ref="preparation" title="Préparer le match"><div class="preparation-form"><label>Nom de votre équipe<input v-model="name" maxlength="40" :disabled="!!tournament&&!tournament.finished" /></label><label>Tactique<select v-model="tactic" aria-label="Tactique"><option v-for="(label,key) in tactics" :key="key" :value="key">{{ label }}</option></select></label><label>Compétition<select v-model="chosenCircuit" :disabled="!!tournament&&!tournament.finished"><option v-for="(definition,id) in circuits" :key="id" :value="id" :disabled="career.reputation<definition.threshold">{{ definition.name }} · {{ definition.threshold }} réputation</option></select></label></div></GameDialog>
<GameDialog ref="allResults" title="Résultats du tournoi"><template v-if="tournament"><Pager v-model:page="resultRound" :pages="Math.max(1,tournament.round)" label="Journées" /><p class="eyebrow">Journée {{ resultRound+1 }}</p><div v-for="match in tournament.matches.filter(m=>m.round===resultRound+1)" :key="match.home" class="round-result"><span>{{ teamName(match.home) }}</span><strong>{{ match.result.scores[0] }} — {{ match.result.scores[1] }}</strong><span>{{ teamName(match.away) }}</span></div><p v-if="!tournament.matches.length">Les rencontres restent à jouer.</p></template></GameDialog>
<GameDialog ref="report" title="Bilan du dernier match"><MatchReport v-if="lastMatch" :result="lastMatch.result" :side="lastMatch.home==='club'?0:1" :opponent-name="teamName(lastMatch.home==='club'?lastMatch.away:lastMatch.home)??'Adversaire'" /></GameDialog>
<GameDialog ref="trainingHelp" title="Le camp individuel"><p>Un camp coûte 100 F et dure sept jours. Il travaille deux caractéristiques, avec un gain maximum d’un point sur chacune, sans dépasser le potentiel ni la note 99.</p><p>Le joueur reçoit huit points de fatigue au retour. Tous les joueurs récupèrent six points par jour. Les matchs restent accessibles pendant le camp.</p><p>Le potentiel est un plafond de progression. Les jeunes ont généralement davantage de marge, mais certains plafonnent tôt et des joueurs plus âgés peuvent encore progresser.</p></GameDialog>
</div>
</template>
