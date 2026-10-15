<script setup lang="ts">
import { computed, ref } from 'vue'
import PlayerAvatar from './PlayerAvatar.vue'
import type { Player } from './game/model'
import { attributeLabels } from './game/model'
import { rating, ratingBands, attributeGroups } from './game/ratings'
import { inactiveAttributes } from './game/analysis'
import { playerProfile } from './game/profiles'
const props=withDefaults(defineProps<{player:Player;year?:number}>(),{year:1983})
const specialty=computed(()=>playerProfile(props.player)),group=ref(0)
const dossier=ref<HTMLDialogElement|null>(null)
defineExpose({open:()=>{group.value=0;if(!dossier.value?.open)dossier.value?.showModal()}})
</script>
<template><Teleport to="body"><dialog ref="dossier" class="player-dossier game-dialog" :aria-label="`Fiche de ${player.firstName} ${player.lastName}`">
<header class="dossier-header"><PlayerAvatar :player="player" /><div><p class="eyebrow">{{ specialty.label }}</p><h2>{{ player.firstName }} <strong>{{ player.lastName }}</strong></h2><p>{{ year-player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Niveau {{ player.overall }} · Potentiel {{ player.potential }}</p></div><form method="dialog"><button aria-label="Fermer la fiche">Fermer ×</button></form></header>
<div class="dossier-content"><p class="profile-description">{{ specialty.description }}</p><div class="game-tabs" role="tablist" aria-label="Caractéristiques"><button v-for="(section,index) in attributeGroups" :key="section.label" role="tab" :aria-selected="group===index" @click="group=index">{{ section.label }}</button></div>
<section v-for="(section,index) in attributeGroups" v-show="group===index" :key="section.label" class="dossier-group" role="tabpanel" :aria-label="section.label"><h3>{{ section.label }}</h3><dl><div v-for="key in section.attributes" :key="key" class="attribute-row"><dt>{{ attributeLabels[key] }}<small v-if="inactiveAttributes.includes(key)" class="inactive-tag">Hors simulation</small></dt><dd class="rating-badge" :class="rating(player.attributes[key]).key">{{ player.attributes[key] }}</dd></div></dl></section>
<div class="rating-legend"><span v-for="band in ratingBands" :key="band.key" class="rating-badge" :class="band.key">{{ band.label }} <small>{{ band.min }}–{{ band.max }}</small></span></div><p class="hint dossier-note">Le profil décrit les notes, sans bonus. Les notes « Hors simulation » et la portée des tirs ne sont pas encore prises en compte en match.</p></div></dialog></Teleport></template>
