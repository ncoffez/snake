<template>
<header>
  <a href="" role="button" @click.prevent="game.start()" v-if="game.status !== 'active'">Start Game</a>
  <a href="" role="button" @click.prevent="game.pause()" v-else class="secondary">Pause [ {{ snake.length }} ]</a>
</header>
<section id="board" data-boardsize="boardsize" :data-active="game.status === 'active'">
  <div class="cell" :class="cell" v-for="cell in board">
  </div>
</section>
<dialog :open="!snake.alive">
  <article>
    <header>
      <hgroup>
        <h1>Game over</h1>
        <p>
          <span v-if="snake.length === 25 * 25">You nailed it! Congrats man, you are amazing!</span>
          <span v-if="snake.length > 500 && snake.length < 25 * 25">That was incredible!</span>
          <span v-if="snake.length > 200 && snake.length <= 500">How did you do that??</span>
          <span v-if="snake.length > 30 && snake.length <= 200">You sir are brilliant!</span>
          <span v-if="snake.length <= 30 && snake.length > 5">We'll get them next time!</span>
          <span v-if="snake.length <= 5 && snake.length > 1">I bet you can do it better.</span>
          <span v-if="snake.length === 1">What happened? Are you alright?</span>
          <span v-if="snake.length > 25 * 25 || snake.length <= 0">Smells fishy... How are you this {{ snake.length <= 0 ? 'bad' : 'good' }}?</span>
        </p>
      </hgroup>
    </header>
    <h2>Your Score: {{ snake.length }}</h2>
    <form>
      <label for="name">Name</label>
      <input id="name" type="text" autocomplete="off" v-model="name" max="12" min="2">
      <a href="" @click.prevent="submitHighscore(snake.length, game.timer, name); game.reset()" class="contrast">Submit</a>
    </form>
    <footer>
      <a href="" role="button" class="secondary" @click.prevent="game.reset()">Continue</a>
    </footer>
  </article>
</dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Snake, Food, Field } from '@/assets/Objects'
import { db } from '@/firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'

class Game {
  moveInterval: any;
  status: "active" | "paused" | "over" = "over"
  timer: number = 0;
  gameTimer: any;

  start() {
    this.status = "active";
    document.getElementById('board')?.scrollIntoView({ block: 'center', inline: 'center' });
    const speed = 50 + (120 - 50) * Math.exp(-snake.value.length / 10);
    this.moveInterval = setInterval(() => {
      snake.value.move();
      updateBoard();
    }, speed);
    this.startTimer();
  }
  pause() {
    this.status = 'paused'
    clearInterval(this.moveInterval);
    this.stopTimer()
  }

  reset() {
    clearInterval(this.moveInterval)
    this.status = "over"
    this.timer = 0;
    Object.assign(snake.value, new Snake());
    Object.assign(food.value, new Food());
  }

  faster() {
    this.pause()
    this.start()
  }

  playAgain() {
    this.pause();
    this.reset();
    this.start();
  }

  startTimer() {
    this.gameTimer = setInterval(() => {
      this.timer++
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.gameTimer);
  }

}

const board = ref(Array(25 * 25))
const snake = ref(new Snake)
const food = ref(new Food)
const game = ref(new Game)
const name = ref("")


const updateBoard = () => {
  if (isOutOfBounds(snake.value)) {
    snake.value.alive = false
    return
  }
  board.value.fill("")
  board.value[food.value.field()] = 'food'
  board.value[snake.value.field()] = 'head'
  snake.value.tail.forEach((v, i) => board.value[v.field()] = 'snake')
}

watch(snake.value, v => {
  if (!v.alive) { game.value.pause() }
  if (v.field() == food.value.field()) {
    const isWon = snake.value.eat();
    if (isWon === "gameIsWon") wonGame();
    food.value.next([...snake.value.tail, new Field(snake.value.x, snake.value.y)]);
    updateBoard();
    game.value.faster();
  }
  if (v.tail.slice(undefined, -1).some(tail => tail.field() === v.field())) snake.value.alive = false
})


const keyboardHandler = (event) => {
  const pressedRight = (event.key === "ArrowRight" || event.code === "KeyD");
  const pressedLeft = (event.key === "ArrowLeft" || event.code === "KeyA");
  const pressedUp = (event.key === "ArrowUp" || event.code === "KeyW");
  const pressedDown = (event.key === "ArrowDown" || event.code === "KeyS");
  const pressedPause = (event.code === "Space");

  if ((pressedDown || pressedLeft || pressedRight || pressedUp || pressedPause) && game.value.status === 'active') {
    event.preventDefault();
  }
  if (pressedPause && game.value.status === 'active') { game.value.pause(); return }
  if ((pressedDown || pressedLeft || pressedRight || pressedUp || pressedPause) && game.value.status !== 'active') game.value.start()
  const moving = getMoveDirection();

  if (pressedRight && moving !== 'left') snake.value.direction = "right";
  if (pressedLeft && moving !== 'right') snake.value.direction = "left";
  if (pressedUp && moving !== 'down') snake.value.direction = "top";
  if (pressedDown && moving !== 'up') snake.value.direction = "bottom";
}

const touchHandler = (event) => {
  event.preventDefault();
  const touchX = event.touches[0].clientX
  const touchY = event.touches[0].clientY
  const snakeX = document.querySelector(".head")!.getBoundingClientRect().left
  const snakeY = document.querySelector(".head")!.getBoundingClientRect().top

  const pressedRight = touchX >= snakeX
  const pressedLeft = touchX < snakeX
  const pressedUp = touchY < snakeY
  const pressedDown = touchY >= snakeY

  if ((pressedDown || pressedLeft || pressedRight || pressedUp) && game.value.status !== 'active') game.value.start()
  if (event.touches[2]) { game.value.pause() };
  const moving = getMoveDirection();

  if (['left', 'right'].includes(moving) && pressedUp) snake.value.direction = "top";
  if (['left', 'right'].includes(moving) && pressedDown) snake.value.direction = "bottom";
  if (['up', 'down'].includes(moving) && pressedLeft) snake.value.direction = "left";
  if (['up', 'down'].includes(moving) && pressedRight) snake.value.direction = "right";
  if (moving === undefined) { // if snake has no tail yet
    if (['left', 'right'].includes(snake.value.direction) && pressedUp) { snake.value.direction = "top"; return; }
    if (['left', 'right'].includes(snake.value.direction) && pressedDown) { snake.value.direction = "bottom"; return; }
    if (['top', 'bottom'].includes(snake.value.direction) && pressedLeft) { snake.value.direction = "left"; return; }
    if (['top', 'bottom'].includes(snake.value.direction) && pressedRight) { snake.value.direction = "right"; return }
  }
}

document.addEventListener('keydown', keyboardHandler)
document.addEventListener('touchstart', touchHandler)

function wonGame() {
  game.value.pause;
  snake.value.alive = false
}

function isOutOfBounds({ x, y }: Field) { return x < 0 || x >= 25 || y < 0 || y >= 25 }
onMounted(updateBoard)
onUnmounted(() => game.value.pause())
async function submitHighscore(length: number, duration: number, name: string) {
  const data = { length, duration, name, date: Timestamp.now() };
  const newEntry = await addDoc(collection(db, 'highscores'), data)
}

function getMoveDirection() {
  let moving;
  if (snake.value.length > 1) {
    const previous = snake.value.tail.slice(-1)[0].field() === snake.value.field() ? snake.value.tail.slice(-2, -1)[0] : snake.value.tail.slice(-1)[0]
    switch (previous?.field() - snake.value.field()) {
      case 1: moving = "left"; break;
      case -1: moving = "right"; break;
      case -25: moving = "down"; break;
      case 25: moving = "up"; break;
    }
  } else { moving = undefined }
  return moving;
}

</script>

<style scoped>
* {
  touch-action: manipulation;
}

.cell {
  width: 100%;
  height: 100%;
  background-color: var(--cell-background);
  border: 1px solid var(--background-color);
  box-sizing: content-box;
}

.snake,
.head {
  background-color: var(--primary);
}

.food {
  background-color: var(--secondary);
}

#board {
  width: min(100%, 90vw);
  max-width: 50vh;
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  margin-block: auto;

}

#board:hover[data-active="active"] {
  cursor: none
}

dialog>article {
  min-width: min(600px, 50%);
}

form>a {
  display: block;
  text-align: end
}

form>h1 {
  margin-bottom: .5rem;
}

header {
  display: flex;
  gap: 2em;
  padding-block: 0 2em;
  place-items: center
}

header p {
  margin-bottom: 0
}
</style>