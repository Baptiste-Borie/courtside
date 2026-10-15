<script setup lang="ts">
import { computed } from 'vue'
import PlayerAvatar from './PlayerAvatar.vue'
import type { Attribute, Player } from './game/model'
import { attributeLabels } from './game/model'
import { inactiveAttributes } from './game/analysis'
import { playerProfile } from './game/profiles'
import { rating } from './game/ratings'
import { positionLabels } from './game/lineup'
const props=defineProps<{player:Player;armed:boolean;role:string}>()
defineEmits<{choose:[];inspect:[];start:[event:DragEvent];end:[]}>()
const profile=computed(()=>playerProfile(props.player))
const strengths=computed(()=>(Object.entries(props.player.attributes) as [Attribute,number][]).filter(([key])=>!inactiveAttributes.includes(key)).sort((a,b)=>b[1]-a[1]).slice(0,2))
</script>
<template>
<article class="lineup-token" :class="{'is-armed':armed}" :data-player-id="player.id" draggable="true" @dragstart="$emit('start',$event)" @dragend="$emit('end')">
  <button type="button" class="lineup-select" :aria-label="`Sélectionner ${player.firstName} ${player.lastName} · ${role}`" :aria-pressed="armed" @click="$emit('choose')">
    <span class="lineup-identity"><PlayerAvatar :player="player" /><span><small>{{ player.firstName }}</small><strong>{{ player.lastName }}</strong></span><span class="lineup-overall"><b>{{ player.overall }}</b><small>NIV</small></span></span>
    <span class="role-stamp">{{ profile.label }}</span>
    <span class="lineup-physical">{{ positionLabels[player.position] }} · {{ player.height }} cm · {{ player.weight }} kg</span>
    <span class="lineup-strengths"><span v-for="[key,value] in strengths" :key="key">{{ attributeLabels[key] }} <b :class="rating(value).key">{{ value }}</b></span></span>
  </button>
  <div class="lineup-token-footer"><span :class="{'is-tired':player.fatigue>20}">Fatigue <b>{{ player.fatigue }}</b>/100</span><button type="button" :aria-label="`Fiche de ${player.firstName} ${player.lastName}`" @click="$emit('inspect')">Fiche ↗</button></div>
</article>
</template>
