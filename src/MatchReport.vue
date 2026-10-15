<script setup lang="ts">
import { computed } from 'vue'
import { matchTotals } from './game/analysis'
import type { MatchResult } from './game/model'
const props=defineProps<{ result:MatchResult; side:0|1; opponentName:string }>()
const us=computed(()=>matchTotals(props.result.stats[props.side]))
const them=computed(()=>matchTotals(props.result.stats[props.side===0?1:0]))
const comparisons=computed(()=>[
 {label:'Points sur tirs intérieurs',ours:us.value.insideMade,theirs:them.value.insideMade},
 {label:'Points sur tirs extérieurs',ours:us.value.outsideMade*2,theirs:them.value.outsideMade*2},
 {label:'Rebonds',ours:us.value.rebounds,theirs:them.value.rebounds},
 {label:'Passes décisives',ours:us.value.assists,theirs:them.value.assists},
 {label:'Interceptions',ours:us.value.steals,theirs:them.value.steals},
 {label:'Contres',ours:us.value.blocks,theirs:them.value.blocks},
])
</script>
<template>
<div class="match-report" aria-label="Bilan du dernier match">
  <h3>Le match en chiffres</h3>
  <div class="table-wrap"><table><caption>Comparaison avec {{ opponentName }}</caption><thead><tr><th>Indicateur</th><th>Votre équipe</th><th>Adversaire</th></tr></thead><tbody>
    <tr><th>Tirs réussis</th><td>{{ us.made }}/{{ us.attempted }} · {{ us.shooting===null?'—':`${us.shooting} %` }}</td><td>{{ them.made }}/{{ them.attempted }} · {{ them.shooting===null?'—':`${them.shooting} %` }}</td></tr>
    <tr><th>Tirs extérieurs réussis</th><td>{{ us.outsideMade }}/{{ us.outsideAttempted }}</td><td>{{ them.outsideMade }}/{{ them.outsideAttempted }}</td></tr>
    <tr v-for="row in comparisons" :key="row.label"><th>{{ row.label }}</th><td>{{ row.ours }}</td><td>{{ row.theirs }}</td></tr>
  </tbody></table></div>
  <p class="hint">Un panier intérieur vaut 1 point, un tir extérieur 2. Ces chiffres décrivent ce match ; ils aident à repérer les écarts de réussite, de rebond et de circulation du ballon.</p>
</div>
</template>
