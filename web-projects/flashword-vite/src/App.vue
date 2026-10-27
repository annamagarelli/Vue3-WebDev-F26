<script>
import WordCard from './components/WordCard.vue';

export default {
  components: {
    WordCard,
  },
  data() {
    return {
      words: [
        // {
        //   word_a: 'hola',
        //   word_b: 'hello',
        //   hint: 'greeting',
        // },
        // {
        //   word_a: 'uno',
        //   word_b: 'one',
        //   hint: 'number',
        // },
        // {
        //   word_a: 'gris',
        //   word_b: 'grey',
        //   hint: 'color',
        // },
      ],
      correctCount: 0,
      completed: false,
      resetKey: 0,
      error: false,
    };
  },
  computed: {
    shuffledWords() {
      return [...this.words].sort(() => 0.5 - Math.random());
    },
    wordCount() {
      return this.words.length;
    },
  },
  watch: {
    correctCount() {
      this.completed = this.correctCount == this.wordCount;
    },
  },
  methods: {
    incrementCorrectCount() {
      this.correctCount++;
    },
    resetGame() {
      this.correctCount = 0;
      this.completed = false;
      this.resetKey++;
    },
  },
  async created() {
    try {
      let response = await fetch('/api/words');
      if (!response.ok) {
        throw new Error('Server response not ok. Status: ' + response.status);
      }
      this.words = await response.json();
    } catch (error) {
      console.error('Error: Unable to fetch words. ', error);
      this.error = true;
      //make error variable to display error message in UI
    }
  },
};
</script>

<template>
  <div id="app" v-cloak>
    <p v-if="error" data-cy="error" id="error">
      Error: Unable to fetch words from the server. Please try again later.
    </p>
    <div v-else>
      <h2 data-cy="app-header">FlashWord</h2>
      <p v-if="completed" data-cy="completed" id="completed">
        Great work, you have completed all the words!
      </p>
      <p v-else data-cy="correct-count" id="correctCount">
        You have answered
        <span data-cy="num-correct">{{ correctCount }}</span> /
        <span data-cy="total-words">{{ wordCount }}</span>
      </p>
      <button data-cy="reset" type="button" v-on:click="resetGame">
        Reset game
      </button>

      <div id="cards">
        <WordCard
          v-for="word in shuffledWords"
          v-bind:data-cy="word.word_a + '-card'"
          v-bind:key="word.word_a + resetKey"
          v-bind:word="word"
          v-on:incrementCorrectCount="incrementCorrectCount"
        >
        </WordCard>
      </div>
    </div>
  </div>

  <!-- <h2 data-cy="app-header">FlashWord</h2>
    <p v-if="completed" data-cy="completed" id="completed">
      Great work, you have completed all the words!
    </p>
    <p v-else data-cy="correct-count" id="correctCount">
      You have answered <span data-cy="num-correct">{{ correctCount }}</span> /
      <span data-cy="total-words">{{ wordCount }}</span>
    </p>
    <button data-cy="reset" type="button" v-on:click="resetGame">
      Reset game
    </button>

    <div id="cards">
      <WordCard
        v-for="word in shuffledWords"
        v-bind:data-cy="word.word_a + '-card'"
        v-bind:key="word.word_a + resetKey"
        v-bind:word="word"
        v-on:incrementCorrectCount="incrementCorrectCount"
      >
      </WordCard>
    </div>
  </div> -->
</template>

<style scoped>
[v-cloak] {
  display: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  margin-top: 60px;
}

#cards {
  justify-content: center;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-gap: 30px;
}

#correctCount {
  font-size: 20px;
  margin: 10px;
  font-weight: bold;
  padding: 10px;
}

#completed {
  font-size: 20px;
  font-weight: bold;
  color: #0f5132;
  padding: 10px;
  margin: 10px;
}
</style>
