<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import CourtPoster from './CourtPoster.vue'
import BoosterOpening from './BoosterOpening.vue'
import PlayerCard from './PlayerCard.vue'
import { foundingCandidates, type Founding, type FoundingPhase } from './game/founding'
const props=defineProps<{name:string;founding:Founding;saveStatus:string;error:string}>()
const emit=defineEmits<{'update:name':[value:string];'update:founding':[value:Founding];pick:[id:string];confirm:[];restart:[];menu:[]}>()
const candidates=computed(()=>foundingCandidates(props.founding.generation)),page=ref(0),pageSize=ref(window.innerWidth<600?1:4)
function resize(){const size=window.innerWidth<600?1:4;if(size!==pageSize.value){page.value=Math.floor(page.value*pageSize.value/size);pageSize.value=size}}
onMounted(()=>window.addEventListener('resize',resize));onUnmounted(()=>window.removeEventListener('resize',resize))
const lastPage=computed(()=>Math.ceil(candidates.value.length/pageSize.value)-1)
const phase=computed<FoundingPhase>(()=>props.founding.phase??(props.founding.revealed.length===12?'selection':'packs'))
const chosen=computed(()=>props.founding.selected.map(id=>candidates.value.find(player=>player.id===id)!))
const visible=computed(()=>candidates.value.slice(page.value*pageSize.value,page.value*pageSize.value+pageSize.value))
const phases:FoundingPhase[]=['intro','identity','packs','selection']
const labels=['Le départ','Le nom','Les rencontres','L’effectif']
function go(value:FoundingPhase) {emit('update:founding',{...props.founding,phase:value})}
watch([phase,page],()=>window.scrollTo(0,0),{flush:'post'})
watch(()=>props.founding.selected.length,count=>{if(count===0)page.value=0})
</script>
<template>
<div class="founding-screen career-flow">
<header class="flow-header"><span class="brand">COURTSIDE <span class="brand-edition">1983</span></span><ol class="flow-steps" aria-label="Création de carrière"><li v-for="(label,index) in labels" :key="label" :aria-current="phase===phases[index]?'step':undefined"><span>{{ String(index+1).padStart(2,'0') }}</span>{{ label }}</li></ol><button @click="emit('menu')">Menu principal</button></header>
<main class="flow-main" :class="`phase-${phase}`">
<p v-if="error" role="alert">{{ error }}</p>
<section v-if="phase==='intro'" class="flow-scene"><div><p class="eyebrow">FRANCE · PRINTEMPS 1983</p><h1>Tout commence<br>sur le <em>bitume.</em></h1><p class="scene-copy">Un panier, quelques habitués et une place à prendre. Tu montes ton équipe de streetball pour entrer dans le circuit local.</p><p class="hint">D’abord un nom. Ensuite des rencontres. Puis ton premier tournoi.</p><button class="primary scene-next" @click="go('identity')">C’est parti ↗</button></div><CourtPoster /></section>
<section v-else-if="phase==='identity'" class="flow-scene identity-scene"><div><p class="eyebrow">01 / FAIRE EXISTER LE CLUB</p><h1>Un nom.<br>Des <em>couleurs.</em></h1><p class="scene-copy">C’est ce nom qu’on annoncera au bord du terrain.</p><label for="founding-name">Le nom de ton équipe</label><input id="founding-name" aria-label="Nom de ton équipe" :value="name" maxlength="40" @input="emit('update:name',($event.target as HTMLInputElement).value)" @keyup.enter="name.trim()&&go('packs')" /><div class="scene-controls"><button @click="go('intro')">Retour</button><button class="primary" :disabled="!name.trim()" @click="go('packs')">Rencontrer les joueurs ↗</button></div></div><CourtPoster /></section>
<template v-else-if="phase==='packs'"><div class="flow-context"><button @click="go('identity')">← Le nom du club</button><span>{{ name }} / LES PREMIÈRES RENCONTRES</span></div><BoosterOpening :founding="founding" @continue="go('selection')" @update:founding="emit('update:founding',$event)" /></template>
<template v-else><div class="flow-context"><button @click="go('packs')">← Les pochettes</button><span>{{ name }} / CONSTRUIRE LE GROUPE</span></div><div class="draft-heading"><div><p class="eyebrow">LES GENS DU PLAYGROUND</p><h1>Qui embarque avec toi ?</h1></div><p class="draft-progress"><strong>{{ founding.selected.length }}/6</strong> joueurs choisis</p></div><p class="hint">Six places, douze profils. Tes trois premiers choix formeront le trois de départ, modifiable ensuite.</p><div class="draft-pagination"><button :disabled="page===0" @click="page--">Page précédente</button><span>Joueurs {{ page*pageSize+1 }}–{{ page*pageSize+visible.length }} / 12</span><button :disabled="page===lastPage" @click="page++">Page suivante</button></div><div class="draft-grid"><PlayerCard v-for="(player,index) in visible" :key="player.id" :player="player" :index="page*pageSize+index" mode="draft" :chosen="founding.selected.includes(player.id)" :disabled="founding.selected.length===6&&!founding.selected.includes(player.id)" @toggle="emit('pick',player.id)" /></div><section class="founding-confirm" aria-label="Votre sélection"><div><p class="eyebrow">L’ÉQUIPE PREND FORME</p><h2>{{ founding.selected.length }}<span>/6 joueurs</span></h2><p class="chosen-names">{{ chosen.map(player=>`${player.firstName} ${player.lastName}`).join(' · ')||'Tes premières recrues t’attendent.' }}</p></div><button class="primary" :disabled="founding.selected.length!==6||!name.trim()" @click="emit('confirm')">Entrer dans le circuit ↗</button></section></template>
<p class="flow-save hint" role="status">{{ saveStatus }}</p>
</main>
</div>
</template>
