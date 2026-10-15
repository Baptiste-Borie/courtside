<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Attribute, Player } from './game/model'
import { rating } from './game/ratings'
import PlayerDossier from './PlayerDossier.vue'
import { attributeLabels } from './game/model'
import { inactiveAttributes } from './game/analysis'
import { playerProfile } from './game/profiles'
const props=withDefaults(defineProps<{player:Player;year?:number;index?:number;chosen?:boolean;mode?:'draft'|'roster'|'scout'|'reveal';disabled?:boolean;cost?:number;hired?:boolean}>(),{year:1983,index:0,chosen:false,mode:'roster',disabled:false,hired:false})
defineEmits<{toggle:[];hire:[]}>()
const specialty=computed(()=>playerProfile(props.player))
const strengths=computed(()=>(Object.entries(props.player.attributes) as [Attribute,number][]).filter(([key])=>!inactiveAttributes.includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,3))
const dossier=ref<InstanceType<typeof PlayerDossier>|null>(null)
</script>
<template>
<article class="player-card" :class="{'is-chosen':chosen}" :data-player-id="player.id">
  <div class="player-visual" aria-hidden="true"><span class="player-number">{{ String(index+1).padStart(2,'0') }}</span><svg viewBox="0 0 180 160" class="jersey"><path d="M60 15 37 22 8 60 35 80 48 61v87h84V61l13 19 27-20-29-38-23-7c-3 23-57 23-60 0Z" fill="currentColor"/><path d="M60 15c0 35 60 35 60 0M48 61 37 22m95 39 11-39" fill="none" stroke="white" stroke-opacity=".4" stroke-width="3"/><text x="90" y="113" text-anchor="middle" fill="white" font-size="34" font-family="system-ui" font-weight="800">{{ player.firstName[0] }}{{ player.lastName[0] }}</text></svg><span class="role-stamp">{{ specialty.label }}</span></div>
  <div class="player-body"><p class="eyebrow">{{ year-player.birthYear }} ans <span>·</span> {{ player.height }} cm <span>·</span> {{ player.weight }} kg</p><h3><span>{{ player.firstName }}</span> {{ player.lastName }}</h3>
    <div class="player-skills"><div v-for="([key,value]) in strengths" :key="key"><span>{{ attributeLabels[key] }}</span><strong class="rating-badge" :class="rating(value).key" :aria-label="`${value} sur 100 : ${rating(value).label}`">{{ value }}</strong><div class="skill-track" aria-hidden="true"><i :class="rating(value).key" :style="{width:`${value}%`}"></i></div></div></div>
    <div class="player-meta"><span>Potentiel <b>{{ player.potential }}</b></span><span v-if="mode!=='draft'">Fatigue <b>{{ player.fatigue }}<small>/100</small></b></span></div>
    <button class="player-details-button" @click="dossier?.open()">Voir la fiche complète <span aria-hidden="true">↗</span></button>
    <button v-if="mode==='draft'" class="draft-pick" :class="{primary:chosen}" :aria-pressed="chosen" :disabled="disabled" @click="$emit('toggle')">{{ chosen?'Retirer de l’effectif':'Choisir ce joueur' }}</button>
    <label v-else-if="mode==='roster'" class="selection"><input type="checkbox" :checked="chosen" :disabled="disabled" @change="$emit('toggle')" /><span>{{ chosen?'Dans le trois de départ':'Placer dans le trois' }}</span></label>
    <button v-else-if="mode==='scout'" :disabled="disabled||hired" @click="$emit('hire')">{{ hired?'Dans votre équipe':`Recruter · ${cost} F` }}</button>
  </div>
</article>
<PlayerDossier ref="dossier" :player="player" :year="year" />
</template>
