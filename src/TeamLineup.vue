<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Player } from './game/model'
import { lineupPositions, placePlayer, selectedFromLineup, sendToBench, type Lineup } from './game/lineup'
import LineupToken from './LineupToken.vue'
import PlayerDossier from './PlayerDossier.vue'
const props=defineProps<{roster:Player[];lineup:Lineup;year:number;name:string}>()
const emit=defineEmits<{'update:lineup':[value:Lineup]}>()
const armed=ref<string|null>(null),dragged=ref<string|null>(null),hover=ref<number|'bench'|null>(null),notice=ref('')
const inspecting=ref<string|null>(null),dossier=ref<InstanceType<typeof PlayerDossier>|null>(null)
const selected=computed(()=>selectedFromLineup(props.lineup))
const bench=computed(()=>props.roster.filter(p=>!selected.value.includes(p.id)))
const inspected=computed(()=>props.roster.find(p=>p.id===inspecting.value))
const armedPlayer=computed(()=>props.roster.find(p=>p.id===armed.value))
const playerAt=(index:number)=>props.roster.find(p=>p.id===props.lineup[index])
watch(()=>props.lineup,()=>{armed.value=null;dragged.value=null;hover.value=null})
function cancel(){armed.value=null;dragged.value=null;hover.value=null}
function place(id:string,index:number){
  try {emit('update:lineup',placePlayer(props.lineup,props.roster,id,index));notice.value=`${props.roster.find(p=>p.id===id)!.firstName} placé au poste de ${lineupPositions[index]!.label.toLowerCase()}.`;cancel()}
  catch {notice.value='Ce joueur ne peut pas être placé ici.';cancel()}
}
function choose(id:string){
  if(armed.value===id){cancel();return}
  const target=props.lineup.indexOf(id),source=armed.value?props.lineup.indexOf(armed.value):-1
  if(armed.value&&target!==-1){place(armed.value,target);return}
  if(armed.value&&source!==-1){place(id,source);return}
  armed.value=id;notice.value=''
}
function empty(index:number){if(armed.value)place(armed.value,index);else notice.value='Sélectionne un joueur du banc, puis ce poste.'}
function benchOut(id:string){
  emit('update:lineup',sendToBench(props.lineup,id));notice.value='Joueur envoyé sur le banc. Choisis son remplaçant.';cancel()
}
function start(event:DragEvent,id:string){
  if(!event.dataTransfer)return
  dragged.value=id;armed.value=null;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id)
}
function over(event:DragEvent,target:number|'bench'){
  if(!dragged.value)return
  event.preventDefault();hover.value=target
  if(event.dataTransfer)event.dataTransfer.dropEffect='move'
}
function drop(event:DragEvent,target:number|'bench'){
  event.preventDefault()
  const id=event.dataTransfer?.getData('text/plain')
  if(!id||id!==dragged.value){cancel();return}
  if(target==='bench'){if(props.lineup.includes(id))benchOut(id);else cancel()}else place(id,target)
}
function dropOnPlayer(event:DragEvent,id:string){
  event.preventDefault()
  const source=dragged.value?props.lineup.indexOf(dragged.value):-1
  if(source!==-1&&event.dataTransfer?.getData('text/plain')===dragged.value)place(id,source)
  else cancel()
}
async function inspect(id:string){inspecting.value=id;await nextTick();dossier.value?.open()}
</script>
<template>
<section class="lineup-board" aria-labelledby="lineup-title" @keydown.esc="cancel">
  <header class="lineup-heading"><div><p class="eyebrow">{{ name }} / COMPOSITION</p><h2 id="lineup-title">Ton trois de départ.</h2></div><span class="lineup-count"><b>{{ selected.length }}</b> / 3 <small>sur le terrain</small></span></header>
  <div class="lineup-instructions"><p v-if="armedPlayer"><strong>{{ armedPlayer.firstName }} {{ armedPlayer.lastName }}</strong> sélectionné. Choisis un poste ou un joueur à échanger.</p><p v-else>Glisse un joueur sur le terrain pour le titulariser. Tu peux aussi sélectionner un joueur puis son emplacement.</p><button v-if="armed" type="button" @click="cancel">Annuler</button></div>
  <div class="lineup-layout">
    <div class="lineup-court" aria-label="Terrain de composition 3 contre 3">
      <svg class="lineup-court-lines" viewBox="0 0 600 650" preserveAspectRatio="none" aria-hidden="true"><path d="M25 25h550v600H25zM220 25v200h160V25M65 25v145a250 250 0 0 0 470 0V25"/><circle cx="300" cy="225" r="75"/><path d="M265 65h70M300 65v15M25 625a75 75 0 0 1 150 0"/><circle cx="300" cy="92" r="13"/></svg>
      <span class="lineup-court-brand" aria-hidden="true">3×3<span>COURTSIDE PLAYGROUND</span></span>
      <div v-for="(slot,index) in lineupPositions" :key="slot.position" class="lineup-slot" :class="[`slot-${slot.position}`,{'is-drop-target':hover===index,'is-empty':!playerAt(index)}]" :data-slot="slot.position" @dragover="over($event,index)" @dragleave="hover===index&&(hover=null)" @drop.stop="drop($event,index)">
        <div class="lineup-slot-title"><span>{{ String(index+1).padStart(2,'0') }}</span><strong>{{ slot.label }}</strong><button v-if="playerAt(index)" type="button" :aria-label="`Mettre ${playerAt(index)!.firstName} ${playerAt(index)!.lastName} sur le banc`" @click="benchOut(playerAt(index)!.id)">−</button></div>
        <LineupToken v-if="playerAt(index)" :player="playerAt(index)!" :role="slot.label" :armed="armed===playerAt(index)!.id" @choose="choose(playerAt(index)!.id)" @inspect="inspect(playerAt(index)!.id)" @start="start($event,playerAt(index)!.id)" @end="cancel" />
        <button v-else type="button" class="lineup-empty" :aria-label="`Placer au poste ${slot.label}`" @click="empty(index)"><span>+</span>{{ armedPlayer?'Placer ce joueur':'Poste à pourvoir' }}</button>
      </div>
    </div>
    <aside class="lineup-bench" :class="{'is-drop-target':hover==='bench'}" aria-labelledby="bench-title" @dragover="over($event,'bench')" @dragleave="hover==='bench'&&(hover=null)" @drop.stop="drop($event,'bench')">
      <header><p class="eyebrow">LA ROTATION</p><h3 id="bench-title">Le banc <span>{{ bench.length }}</span></h3><p>Prêts à entrer en jeu.</p></header>
      <div class="lineup-bench-list"><div v-for="player in bench" :key="player.id" @dragover.stop="over($event,'bench')" @drop.stop="dropOnPlayer($event,player.id)">
        <LineupToken :player="player" role="Banc" :armed="armed===player.id" @choose="choose(player.id)" @inspect="inspect(player.id)" @start="start($event,player.id)" @end="cancel" />
      </div></div>
      <button v-if="armed&&lineup.includes(armed)" type="button" class="lineup-bench-action" @click="benchOut(armed)">Envoyer le joueur sélectionné sur le banc</button>
      <p class="lineup-bench-help">Glisse un titulaire dans cette zone pour le sortir, ou sur un remplaçant pour les échanger.</p>
    </aside>
  </div>
  <p class="lineup-notice" role="status">{{ notice || (selected.length<3?'Complète les trois postes avant de rejoindre le tournoi.':'Trois joueurs en place. À toi de trouver l’alchimie.') }}</p>
  <p class="hint lineup-footnote">Les emplacements indiquent les rôles de ta composition. Le poste naturel de chaque joueur reste affiché ; tu peux essayer d’autres associations. Au-delà de 20 de fatigue, ses performances diminuent.</p>
  <PlayerDossier v-if="inspected" ref="dossier" :player="inspected" :year="year" />
</section>
</template>
