<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Attribute, Player } from './game/model'
import { rating, ratingBands, attributeGroups } from './game/ratings'
import { attributeLabels } from './game/model'
import { inactiveAttributes, teamProfile } from './game/analysis'
const props=withDefaults(defineProps<{player:Player;year?:number;index?:number;chosen?:boolean;mode?:'draft'|'roster'|'scout'|'reveal';disabled?:boolean;cost?:number;hired?:boolean}>(),{year:1983,index:0,chosen:false,mode:'roster',disabled:false,hired:false})
defineEmits<{toggle:[];hire:[]}>()
const profile=computed(()=>teamProfile({id:'profile',name:'',players:Array.from({length:3},()=>({...props.player,fatigue:0}))}))
const specialty=computed(()=>[...profile.value].sort((a,b)=>b.value-a.value)[0]!)
const strengths=computed(()=>(Object.entries(props.player.attributes) as [Attribute,number][]).filter(([key])=>!inactiveAttributes.includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,3))
const dossier=ref<HTMLDialogElement|null>(null)
const roles:Record<string,string>={outside:'Tireur',inside:'Finisseur',creation:'Créateur',pace:'Explosif',defense:'Défenseur',rebound:'Intérieur'}
</script>
<template>
<article class="player-card" :class="{'is-chosen':chosen}" :data-player-id="player.id">
  <div class="player-visual" aria-hidden="true"><span class="player-number">{{ String(index+1).padStart(2,'0') }}</span><svg viewBox="0 0 180 160" class="jersey"><path d="M60 15 37 22 8 60 35 80 48 61v87h84V61l13 19 27-20-29-38-23-7c-3 23-57 23-60 0Z" fill="currentColor"/><path d="M60 15c0 35 60 35 60 0M48 61 37 22m95 39 11-39" fill="none" stroke="white" stroke-opacity=".4" stroke-width="3"/><text x="90" y="113" text-anchor="middle" fill="white" font-size="34" font-family="system-ui" font-weight="800">{{ player.firstName[0] }}{{ player.lastName[0] }}</text></svg><span class="role-stamp">{{ roles[specialty.id] }}</span></div>
  <div class="player-body"><p class="eyebrow">{{ year-player.birthYear }} ans <span>·</span> {{ player.height }} cm <span>·</span> {{ player.weight }} kg</p><h3><span>{{ player.firstName }}</span> {{ player.lastName }}</h3>
    <div class="player-skills"><div v-for="([key,value]) in strengths" :key="key"><span>{{ attributeLabels[key] }}</span><strong class="rating-badge" :class="rating(value).key" :aria-label="`${value} sur 100 : ${rating(value).label}`">{{ value }}</strong><div class="skill-track" aria-hidden="true"><i :class="rating(value).key" :style="{width:`${value}%`}"></i></div></div></div>
    <div class="player-meta"><span>Potentiel <b>{{ player.potential }}</b></span><span v-if="mode!=='draft'">Fatigue <b>{{ player.fatigue }}<small>/100</small></b></span></div>
    <button class="player-details-button" @click="dossier?.showModal()">Voir la fiche complète <span aria-hidden="true">↗</span></button>
    <button v-if="mode==='draft'" class="draft-pick" :class="{primary:chosen}" :aria-pressed="chosen" :disabled="disabled" @click="$emit('toggle')">{{ chosen?'Retirer de l’effectif':'Choisir ce joueur' }}</button>
    <label v-else-if="mode==='roster'" class="selection"><input type="checkbox" :checked="chosen" :disabled="disabled" @change="$emit('toggle')" /><span>{{ chosen?'Dans le trois de départ':'Placer dans le trois' }}</span></label>
    <button v-else-if="mode==='scout'" :disabled="disabled||hired" @click="$emit('hire')">{{ hired?'Dans votre équipe':`Recruter · ${cost} F` }}</button>
  </div>
</article>
<Teleport to="body"><dialog ref="dossier" class="player-dossier" :aria-label="`Fiche de ${player.firstName} ${player.lastName}`"><header class="dossier-header"><div><p class="eyebrow">DOSSIER JOUEUR / {{ roles[specialty.id] }}</p><h2>{{ player.firstName }} <strong>{{ player.lastName }}</strong></h2><p>{{ year-player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Potentiel {{ player.potential }}</p></div><form method="dialog"><button aria-label="Fermer la fiche">Fermer ×</button></form></header>
<div class="dossier-content"><div class="rating-legend" aria-label="Échelle des notes"><span v-for="band in ratingBands" :key="band.key" class="rating-badge" :class="band.key">{{ band.label }} <small>{{ band.min }}–{{ band.max }}</small></span></div><p class="hint">Notes sur 100. Les notes signalées « Hors simulation » sont conservées dans le profil et n’interviennent pas encore dans les matchs.</p>
<div class="attribute-groups"><section v-for="group in attributeGroups" :key="group.label"><h3>{{ group.label }}</h3><dl><div v-for="key in group.attributes" :key="key" class="attribute-row"><dt>{{ attributeLabels[key] }}<small v-if="inactiveAttributes.includes(key)" class="inactive-tag">Hors simulation</small></dt><dd class="rating-badge" :class="rating(player.attributes[key]).key" :aria-label="`${player.attributes[key]} sur 100 : ${rating(player.attributes[key]).label}`">{{ player.attributes[key] }}</dd></div></dl></section></div></div></dialog></Teleport>
</template>
