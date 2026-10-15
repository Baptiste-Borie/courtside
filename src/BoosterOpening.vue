<script setup lang="ts">
import { computed, ref } from 'vue'
import PlayerCard from './PlayerCard.vue'
import { openPack, packCandidates, revealAll, revealCard, type Founding } from './game/founding'
const props=defineProps<{founding:Founding}>()
const emit=defineEmits<{'update:founding':[value:Founding];continue:[]}>()
const focusedCard=ref(0)
const active=ref(props.founding.opened.at(-1) ?? 0),opening=ref<number|null>(null)
const cards=computed(()=>packCandidates(active.value,props.founding.generation))
function open(index:number) {
 focusedCard.value=0;active.value=index
 if(props.founding.opened.includes(index))return
 opening.value=(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.reduceMotion==='true')?null:index
 emit('update:founding',openPack(props.founding,index))
}
function all() {opening.value=null;emit('update:founding',revealAll(props.founding))}
function animationDone(event:AnimationEvent) {if(event.target===event.currentTarget)opening.value=null}
</script>
<template>
<section class="booster-section" aria-labelledby="booster-heading" :data-opening="opening!==null">
  <div class="booster-heading"><div><p class="eyebrow">LES DOSSIERS DU PLAYGROUND</p><h2 id="booster-heading">Des rencontres.<br>Une équipe à inventer.</h2></div><div class="booster-actions"><p role="status">{{ founding.revealed.length }} / 12 joueurs dévoilés</p><button class="reveal-all" @click="all">Tout dévoiler</button></div></div>
  <p class="hint">Ouvre tes trois pochettes, puis retourne les cartes une par une. Tu choisiras ensuite six joueurs parmi les douze. Tout dévoiler ouvre les trois pochettes et révèle tous les profils.</p>
  <div class="booster-packs"><button v-for="index in [0,1,2]" :key="index" class="booster-pack" :class="{'is-open':founding.opened.includes(index),'is-opening':opening===index,'is-active':active===index}" :disabled="opening!==null" :aria-label="`${founding.opened.includes(index)?'Revoir':'Ouvrir'} la pochette ${index+1}`" @click="open(index)" @animationend="animationDone">
    <span class="pack-seal" aria-hidden="true"></span><span class="pack-edition">COURTSIDE / 1983</span><span class="pack-mark" aria-hidden="true">3×3</span><span class="pack-court" aria-hidden="true"><i></i></span><span class="pack-bottom"><b>PLAYGROUND {{ String(index+1).padStart(2,'0') }}</b><span>{{ founding.opened.includes(index)?`${packCandidates(index,founding.generation).filter(player=>founding.revealed.includes(player.id)).length}/4 cartes dévoilées`:'4 JOUEURS · À DÉCOUVRIR' }}</span></span><span class="pack-action">{{ opening===index?'Ouverture…':founding.opened.includes(index)?'Pochette ouverte':'Déchirer la pochette ↗' }}</span>
  </button></div>
  <section v-if="founding.opened.includes(active)" class="pack-reveal" :aria-label="`Cartes de la pochette ${active+1}`"><div class="pack-reveal-title"><h3>Pochette {{ active+1 }} · À toi de les découvrir.</h3><p class="hint">Clique sur chaque carte pour dévoiler le joueur.</p></div>
    <div class="card-pagination"><button :disabled="focusedCard===0" @click="focusedCard--">Carte précédente</button><span>Carte {{ focusedCard+1 }} / 4</span><button :disabled="focusedCard===3" @click="focusedCard++">Carte suivante</button></div><div class="flip-grid"><div v-for="(player,index) in cards" :key="player.id" class="flip-card" :class="{'is-revealed':founding.revealed.includes(player.id),'is-focused':focusedCard===index}" :data-player-id="player.id">
      <div class="flip-inner"><button v-if="!founding.revealed.includes(player.id)" class="flip-back" :disabled="opening!==null||founding.revealed.includes(player.id)" :aria-hidden="founding.revealed.includes(player.id)" :tabindex="founding.revealed.includes(player.id)?-1:0" :aria-label="`Dévoiler la carte ${index+1} de la pochette ${active+1}`" @click="emit('update:founding',revealCard(founding,player.id))"><span class="back-edition">COURTSIDE / DOSSIER {{ String(active*4+index+1).padStart(2,'0') }}</span><span class="back-logo" aria-hidden="true">3×3</span><span class="back-circle" aria-hidden="true"></span><span class="back-call">Un joueur t’attend.<small>Retourner la carte ↗</small></span></button>
        <div v-if="founding.revealed.includes(player.id)" class="flip-front"><PlayerCard :player="player" :index="active*4+index" mode="reveal" /></div>
      </div>
    </div></div>
  </section>
  <p v-else class="sealed-hint">Commence par ouvrir une pochette. Chaque carte cache un joueur du quartier.</p>
  <div v-if="founding.revealed.length===12" class="booster-continue"><div><p class="eyebrow">LES DOUZE SONT LÀ</p><h3>À présent, choisis tes six.</h3></div><button class="primary" @click="emit('continue')">Composer mon effectif ↗</button></div>
</section>
</template>
