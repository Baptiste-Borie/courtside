<script setup lang="ts">
import { computed } from 'vue'
import { teamProfile } from './game/analysis'
import type { Team, Tactic } from './game/model'
import { tactics } from './game/model'
const props=defineProps<{ club:Team|null; opponent:Team; tactic:Tactic }>()
const ours=computed(()=>props.club ? teamProfile(props.club) : null)
const theirs=computed(()=>teamProfile(props.opponent))
const descriptions:Record<Tactic,string>={
 balanced:'Répartit les occasions entre finition et tir extérieur. Environ 35 % des tirs sont pris de loin.',
 fast:'Confie davantage le ballon aux joueurs rapides et favorise les profils capables de finir en mouvement. Environ 28 % des tirs sont pris de loin.',
 inside:'Privilégie la finition, le jeu au poste et la puissance. Environ 12 % des tirs sont pris de loin.',
}
</script>
<template>
<section class="match-preview" aria-labelledby="preview-title">
  <p class="eyebrow">Préparer le prochain match</p><h2 id="preview-title">Face à {{ opponent.name }}</h2>
  <p v-if="!club" role="status">Choisissez trois titulaires dans Mon équipe pour comparer les formations.</p>
  <div v-else class="table-wrap"><table><caption>Profils sur 100, fatigue actuelle incluse</caption><thead><tr><th>Secteur</th><th>{{ club.name }}</th><th>{{ opponent.name }}</th><th>Écart</th></tr></thead><tbody><tr v-for="(axis,i) in ours" :key="axis.id"><th>{{ axis.label }}</th><td>{{ axis.value }}</td><td>{{ theirs[i]!.value }}</td><td>{{ axis.value-theirs[i]!.value>0?'+':'' }}{{ axis.value-theirs[i]!.value }}</td></tr></tbody></table></div>
  <p class="hint">Les moyennes aident à comparer les profils. La taille, les duels individuels, les choix de tir et le hasard interviennent aussi dans le match. La récupération à venir n’est pas anticipée.</p>
  <h3>Votre plan · {{ tactics[tactic] }}</h3><p>{{ descriptions[tactic] }}</p>
  <p class="hint">La tactique adverse est équilibrée dans ce prototype. Les pourcentages décrivent le plan de jeu ; chaque match peut s’en écarter.</p>
  <details><summary>Voir les trois adversaires</summary><div class="opponent-grid"><article v-for="player in opponent.players" :key="player.id"><h3>{{ player.firstName }} {{ player.lastName }}</h3><p class="hint">{{ player.height }} cm · Fatigue {{ player.fatigue }}/100</p><p>Tir extérieur {{ player.attributes.threePoint }} · Finition {{ player.attributes.insideScoring }} · Passe {{ player.attributes.passing }}</p></article></div></details>
</section>
</template>
