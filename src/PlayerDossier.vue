<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Player } from './game/model'
import { attributeLabels } from './game/model'
import { rating, ratingBands, attributeGroups } from './game/ratings'
import { inactiveAttributes } from './game/analysis'
import { playerProfile } from './game/profiles'
const props=withDefaults(defineProps<{player:Player;year?:number}>(),{year:1983})
const specialty=computed(()=>playerProfile(props.player))
const dossier=ref<HTMLDialogElement|null>(null)
defineExpose({open:()=>{if(!dossier.value?.open)dossier.value?.showModal()}})
</script>
<template>
<Teleport to="body"><dialog ref="dossier" class="player-dossier" :aria-label="`Fiche de ${player.firstName} ${player.lastName}`"><header class="dossier-header"><div><p class="eyebrow">DOSSIER JOUEUR / {{ specialty.label }}</p><h2>{{ player.firstName }} <strong>{{ player.lastName }}</strong></h2><p>{{ year-player.birthYear }} ans · {{ player.height }} cm · {{ player.weight }} kg · Potentiel {{ player.potential }}</p></div><form method="dialog"><button aria-label="Fermer la fiche">Fermer ×</button></form></header>
<div class="dossier-content"><p class="profile-description">{{ specialty.description }} <span>Profil descriptif déduit des notes, sans bonus automatique.</span><span v-if="specialty.id==='sniper'">La portée des tirs n’est pas encore différenciée en match.</span></p><div class="rating-legend" aria-label="Échelle des notes"><span v-for="band in ratingBands" :key="band.key" class="rating-badge" :class="band.key">{{ band.label }} <small>{{ band.min }}–{{ band.max }}</small></span></div><p class="hint">Notes sur 100. Les notes signalées « Hors simulation » sont conservées dans le profil et n’interviennent pas encore dans les matchs.</p>
<div class="attribute-groups"><section v-for="group in attributeGroups" :key="group.label"><h3>{{ group.label }}</h3><dl><div v-for="key in group.attributes" :key="key" class="attribute-row"><dt>{{ attributeLabels[key] }}<small v-if="inactiveAttributes.includes(key)" class="inactive-tag">Hors simulation</small></dt><dd class="rating-badge" :class="rating(player.attributes[key]).key" :aria-label="`${player.attributes[key]} sur 100 : ${rating(player.attributes[key]).label}`">{{ player.attributes[key] }}</dd></div></dl></section></div></div></dialog></Teleport>
</template>
