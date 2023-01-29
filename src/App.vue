<script setup lang="ts">
import Board from '@/components/Board.vue'
import Leaderboard from './components/Leaderboard.vue';

</script>

<template>
  <header class="container">
    <h1>Let's play snake!</h1>
    <Board />
  </header>
<main class="container">
  <Leaderboard />
</main>
<footer class="container">
  <p>This game was produced by <a href="https://www.github.com/ncoffez" target="_blank">@ncoffez</a>. 
    If you'd like to support my work, consider <a href="https://www.buymeacoffee.com/ncoffez" target="_blank">buying me a coffee</a>.</p>
</footer>
</template>

<style scoped>
footer {
  margin-block: 8em 0em;
  padding-bottom: 1em;
}

header>h1 {
  margin-top: 1em;
}

header {
  place-items: center;
  display: grid;
}
</style>
