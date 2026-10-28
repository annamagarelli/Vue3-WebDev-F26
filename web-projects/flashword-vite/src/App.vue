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
      playerName: '',
      leaderboard: [],
      leaderboardError: '',
      scoreSubmitted: false,
      startedAt: Date.now(),
      completedAt: null,
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
      if (this.wordCount > 0 && this.correctCount === this.wordCount) {
        this.completed = true;
        this.completedAt = Date.now();
      }
    },
  },
  methods: {
    incrementCorrectCount() {
      this.correctCount++;
    },
    resetGame() {
      this.correctCount = 0;
      this.completed = false;
      this.completedAt = null;
      this.scoreSubmitted = false;
      this.playerName = '';
      this.startedAt = Date.now();
      this.resetKey++;
    },
    loadLeaderboard() {
      try {
        const stored = JSON.parse(
          localStorage.getItem('flashword-leaderboard') || '[]'
        );
        this.leaderboard = Array.isArray(stored)
          ? this.sortLeaderboard(stored)
          : [];
      } catch (error) {
        this.leaderboard = [];
        this.leaderboardError = 'Unable to load leaderboard scores.';
      }
    },
    sortLeaderboard(entries) {
      return [...entries].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.completedInSeconds !== b.completedInSeconds) {
          return a.completedInSeconds - b.completedInSeconds;
        }
        return a.submittedAt - b.submittedAt;
      });
    },
    submitScore() {
      const name = this.playerName.trim();
      if (!name || name.length > 20) {
        this.leaderboardError = 'Enter a name between 1 and 20 characters.';
        return;
      }
      if (this.scoreSubmitted) return;

      const entry = {
        name,
        score: this.correctCount,
        totalWords: this.wordCount,
        completedInSeconds: Math.max(
          1,
          Math.round((this.completedAt - this.startedAt) / 1000)
        ),
        submittedAt: Date.now(),
      };

      try {
        this.leaderboard = this.sortLeaderboard([...this.leaderboard, entry]);
        localStorage.setItem(
          'flashword-leaderboard',
          JSON.stringify(this.leaderboard)
        );
        this.scoreSubmitted = true;
        this.leaderboardError = '';
      } catch (error) {
        this.leaderboardError = 'Unable to save your score.';
      }
    },
  },
  mounted() {
    this.loadLeaderboard();
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

      <section v-if="completed" data-cy="score-form" id="score-form">
        <h3>Submit your score</h3>
        <label for="player-name">Player name</label>
        <input
          id="player-name"
          data-cy="player-name"
          v-model="playerName"
          type="text"
          maxlength="20"
          placeholder="Your name"
          v-on:keyup.enter="submitScore"
        />
        <button
          data-cy="submit-score"
          type="button"
          v-bind:disabled="scoreSubmitted"
          v-on:click="submitScore"
        >
          {{ scoreSubmitted ? 'Score submitted' : 'Submit score' }}
        </button>
      </section>

      <section data-cy="leaderboard" id="leaderboard">
        <h3>Leaderboard</h3>
        <p v-if="leaderboardError" data-cy="leaderboard-error" role="alert">
          {{ leaderboardError }}
        </p>
        <p v-if="leaderboard.length === 0" data-cy="leaderboard-empty">
          No scores yet. Be the first to play!
        </p>
        <ol v-else>
          <li
            v-for="(entry, index) in leaderboard"
            v-bind:key="entry.submittedAt + '-' + entry.name"
            data-cy="leaderboard-row"
          >
            <span class="leaderboard-rank">{{ index + 1 }}</span>
            <span data-cy="leaderboard-name" class="leaderboard-name">{{
              entry.name
            }}</span>
            <span data-cy="leaderboard-score">{{ entry.score }}/{{ entry.totalWords }}</span>
            <span data-cy="leaderboard-time">{{ entry.completedInSeconds }}s</span>
          </li>
        </ol>
      </section>
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

#score-form,
#leaderboard {
  max-width: 640px;
  margin: 24px auto;
}

#score-form {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 10px;
  align-items: center;
}

#score-form h3 {
  grid-column: 1 / -1;
}

#score-form label {
  font-weight: bold;
}

#leaderboard ol {
  padding: 0;
  list-style: none;
}

#leaderboard li {
  display: grid;
  grid-template-columns: 50px 1fr auto auto;
  gap: 16px;
  align-items: center;
  margin: 8px 0;
  padding: 12px;
  border-radius: 5px;
  background-color: #e8f0ff;
}

.leaderboard-name {
  font-weight: bold;
  text-align: left;
}

.leaderboard-rank {
  font-weight: bold;
}

#completed {
  font-size: 20px;
  font-weight: bold;
  color: #0f5132;
  padding: 10px;
  margin: 10px;
}
</style>
