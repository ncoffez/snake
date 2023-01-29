<template>
<article>
  <h2>Leaderboard</h2>

  <table v-if="leaders">
    <thead>
      <tr>
        <th scope="col">#</th>
        <td class="name">Name</td>
        <td class="score">Score</td>
        <td class="duration">Duration</td>
        <td class="date">Date</td>
      </tr>
    </thead>
    <tr v-for="(leader, index) in leaders">
      <th scope="row">{{ index + 1 }}</th>
      <td class="name">{{ leader.name }}</td>
      <td class="score"><b>{{ leader.length }}</b></td>
      <td class="duration">{{ Intl.NumberFormat('en-CH', { style: 'unit', unit: 'second' }).format(leader.duration) }}</td>
      <td class="date">{{ (leader.date as Timestamp).toDate().toLocaleString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' })
      }}</td>
    </tr>
  </table>
</article>
</template>

<script setup lang="ts">
import { db } from '@/firebase';
import { collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
const q = query(collection(db, 'highscores'), orderBy('length', 'desc'), limit(15));
let leaders: any = ref([]);
let unsubscribe: any;
onMounted(() => {
  unsubscribe = onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach((change) => {
      leaders.value.push(change.doc.data())
      leaders.value.sort((a, b) => b.length - a.length)
    })
  })
})

onUnmounted(unsubscribe);


</script>

<style scoped>
@media only screen and (max-width: 700px) {
  .duration {
    display: none
  }
}

</style>