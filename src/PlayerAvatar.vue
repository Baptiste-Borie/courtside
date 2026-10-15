<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from './game/model'
import { appearanceFor } from './game/appearance'
const props=withDefaults(defineProps<{player:Pick<Player,'firstName'|'lastName'|'birthYear'>;decorative?:boolean}>(),{decorative:true})
const look=computed(()=>appearanceFor(props.player))
const cuts=[
 'M36 48Q33 24 59 23Q85 21 84 48L78 42L76 34L45 35L42 47Z',
 'M34 45Q23 33 35 27Q30 15 43 16Q48 5 59 14Q72 5 78 17Q93 14 91 29Q103 40 85 49L80 34L40 35Z',
 'M36 48L36 28Q59 16 82 29L84 47L77 36L43 36L42 49Z',
 'M36 43Q32 24 47 22L44 13L50 18L54 8L60 17L68 10L70 21Q88 22 84 45L77 34L43 34Z',
 'M36 50Q29 25 48 22Q73 13 84 30L84 48L78 38Q66 41 60 30Q51 41 41 37L42 50Z',
 'M35 49Q29 26 42 21Q59 12 78 23Q91 30 84 52L80 39Q60 27 40 39L41 51Z',
 'M37 43Q35 25 59 24Q83 24 82 43L77 35Q59 31 42 36Z',
 '',
]
</script>
<template><svg class="player-avatar" viewBox="0 0 120 136" :aria-hidden="decorative?true:undefined" :role="decorative?undefined:'img'" :aria-label="decorative?undefined:`Portrait de ${player.firstName} ${player.lastName}`" :data-appearance="`${look.cut}-${look.beard}-${look.skin}`">
<path d="M0 0h120v136H0z" :fill="look.background"/><path d="M0 105 120 25v111H0Z" fill="#fff" opacity=".18"/>
<path d="M5 136 12 112Q17 102 43 97H77Q103 102 108 112L116 136Z" :fill="look.skin"/>
<path d="M46 78H74L77 103Q60 118 43 103Z" :fill="look.skin"/><path d="M46 80H74L73 93Q56 100 46 87Z" fill="#24160d" opacity=".14"/>
<path d="M28 103 40 98Q60 121 80 98L92 103 88 136H32Z" :fill="look.jersey"/><path d="M40 99Q60 122 80 99M29 104 33 136M91 104 87 136" fill="none" stroke="#f9eee0" stroke-width="3"/>
<ellipse cx="36" cy="59" rx="6" ry="10" :fill="look.skin"/><ellipse cx="84" cy="59" rx="6" ry="10" :fill="look.skin"/>
<path :d="look.face===0?'M37 43Q36 25 60 25Q84 25 83 43L82 69Q78 91 60 94Q42 91 38 70Z':look.face===1?'M37 43Q36 25 60 25Q84 25 83 43L81 75 71 89 49 89 39 75Z':'M37 43Q36 25 60 25Q84 25 83 43L84 65Q80 91 60 94Q40 91 36 65Z'" :fill="look.skin"/>
<path d="M40 60Q43 49 55 53M66 53Q78 49 80 60" fill="none" stroke="#fff" opacity=".09" stroke-width="5"/>
<path :d="cuts[look.cut]" :fill="look.hair"/>
<path :d="look.brow===0?'M43 51 54 50M66 50 77 51':look.brow===1?'M43 52 54 49M66 49 77 52':'M43 50 54 51M66 51 77 50'" :stroke="look.hair" stroke-width="3" stroke-linecap="round"/>
<path d="M44 58Q49 55 54 58M66 58Q71 55 76 58" fill="none" stroke="#35291f" stroke-width="1.5"/>
<ellipse cx="50" cy="58" rx="2" ry="2.5" fill="#231e19"/><ellipse cx="70" cy="58" rx="2" ry="2.5" fill="#231e19"/>
<path d="M60 59 57 70 63 71" fill="none" stroke="#482c1f" stroke-opacity=".35" stroke-width="1.5" stroke-linecap="round"/>
<path v-if="look.beard===0" d="M39 65 44 76 51 80H69L76 76 81 65 80 79Q60 104 41 79Z" :fill="look.hair" opacity=".88"/>
<path v-else-if="look.beard===1" d="M50 76Q60 72 70 76L68 80Q60 77 52 80ZM52 86H68L64 92H56Z" :fill="look.hair"/>
<path v-else-if="look.beard===2" d="M49 76Q60 70 71 76L69 79Q60 76 51 79Z" :fill="look.hair"/>
<path d="M53 81Q60 84 67 81" fill="none" stroke="#4b3025" stroke-width="1.6" stroke-linecap="round"/>
<text x="60" y="135" text-anchor="middle" fill="#f9eee0" font-size="16" font-weight="800" font-family="system-ui">{{ look.number }}</text>
</svg></template>
