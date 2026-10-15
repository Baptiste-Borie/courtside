<script setup lang="ts">
import { computed, ref } from 'vue'
import { teamProfile } from './game/analysis'
import type { Team, Tactic } from './game/model'
import { tactics } from './game/model'
import GameDialog from './GameDialog.vue'
import Pager from './Pager.vue'
import PlayerCard from './PlayerCard.vue'
const dossiers=ref<InstanceType<typeof GameDialog>|null>(null),help=ref<InstanceType<typeof GameDialog>|null>(null),page=ref(0)
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
  <div v-else class="table-wrap"><table><caption>Profils sur 100, fatigue actuelle incluse</caption><thead><tr><th>Secteur</th><th>Ton équipe</th><th>Adversaire</th><th>Écart</th></tr></thead><tbody><tr v-for="(axis,i) in ours" :key="axis.id"><th>{{ axis.label }}</th><td>{{ axis.value }}</td><td>{{ theirs[i]!.value }}</td><td>{{ axis.value-theirs[i]!.value>0?'+':'' }}{{ axis.value-theirs[i]!.value }}</td></tr></tbody></table></div>
  <h3>Votre plan · {{ tactics[tactic] }}</h3><p>{{ descriptions[tactic] }}</p>
  <div class="preview-actions"><button @click="dossiers?.open()">Voir les trois adversaires</button><button @click="help?.open()">Lire les profils</button></div><GameDialog ref="help" title="Lire les profils"><p>Ces moyennes comparent les forces des équipes, fatigue actuelle incluse. Taille, duels individuels, choix de tir et hasard interviennent aussi. La récupération à venir n’est pas anticipée.</p><p>La tactique adverse est équilibrée. Les pourcentages décrivent ton plan de jeu ; chaque match peut s’en écarter.</p></GameDialog><GameDialog ref="dossiers" title="Les adversaires"><Pager v-model:page="page" :pages="3" label="Adversaires" /><PlayerCard :player="opponent.players[page]!" mode="reveal" /></GameDialog>
</section>
</template>
