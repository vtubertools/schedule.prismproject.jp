<template>
  <div class="watch">
    <div class="panel-frames" ref="frames-container"
      :style="{ 'grid-template-columns': gridLayout }">
      <div class="frame" v-for="(video, videoKey) in watching" :key="videoKey">
        <div ref="frame-ratio" v-if="video.username">
          <PlayerTwitch :user="video.username" />
        </div>
        <div ref="frame-ratio" v-if="video.id">
          <PlayerYoutube :videoId="video.id" />
        </div>
      </div>
    </div>
    <v-navigation-drawer app permanent right v-if="canShowChat && wantChat" width="320">
      <Chatbox/>
    </v-navigation-drawer>
  </div>
</template>

<script>
import PlayerTwitch from '@/components/PlayerTwitch.vue';
import PlayerYoutube from '@/components/PlayerYoutube.vue';
import Chatbox from '@/components/Chatbox.vue';

export default {
  name: 'Watch',
  data: () => ({
    players: [],
    resizeTimeout: null,
    columnCount: 3,
  }),
  watch: {
    $drawer() {
      this.waitResizeFrame();
    },
    wantChat() {
      this.waitResizeFrame();
    },
    canShowChat() {
      this.waitResizeFrame();
    },
    watching() {
      this.waitResizeFrame();
    },
  },
  computed: {
    listener() {
      return this.$store.state.listener;
    },
    $drawer() {
      return this.$store.state.drawer;
    },
    canShowChat() {
      return !this.$isMobile && this.$vuetify.breakpoint.smAndUp;
    },
    wantChat() {
      return this.$store.state.wantChat;
    },
    channels() {
      return this.$store.state.channels;
    },
    channelsTwitch() {
      return this.$store.state.channelsTwitch;
    },
    twitch() {
      return this.$store.state.twitch;
    },
    live() {
      return this.$store.state.live;
    },
    watching() {
      return this.$store.state.watching;
    },
    gridLayout() {
      return `repeat(${this.columnCount}, 1fr)`;
    },
  },
  methods: {
    waitResizeFrame() {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(this.resizeFrames, 600);
    },
    resizeFrames() {
      this.autoFrames();
    },
    autoFrames() {
      if (!this.watching) return;
      const frameCount = Object.keys(this.watching).length;
      if (!frameCount) return;
      const container = this.$refs['frames-container'];
      if (!container) return;
      const bestSizing = { cols: 0, width: 0 };
      for (let numCols = 1; numCols <= frameCount; numCols += 1) {
        const numRows = Math.ceil(frameCount / numCols);
        const tempWidth = (container.clientWidth - 10) / numCols;
        const tempHeight = (container.clientHeight - 10) / numRows;
        const tempRatio = tempWidth / tempHeight;
        const realWidth = tempRatio > 16 / 9 ? (tempHeight / 9) * 16 : tempWidth;
        if (realWidth > bestSizing.width) {
          bestSizing.cols = numCols;
          bestSizing.width = realWidth - 5;
        }
      }
      this.columnCount = bestSizing.cols;
      const bestWidth = (bestSizing.width / 16) * 9;
      this.$refs['frame-ratio'].forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        el.style.width = `${bestSizing.width}px`;
        // eslint-disable-next-line no-param-reassign
        el.style.height = `${bestWidth}px`;
      });
    },
  },
  mounted() {
    // Watch page automatically minimize the drawer to mini-variant
    this.$store.dispatch('closeDrawer');

    // Initialize watch players, if none on current watch list, add everything
    this.$store.dispatch('openAllVideos');

    // Resizing frames according to available screen size
    this.waitResizeFrame();
    window.onresize = () => {
      this.waitResizeFrame();
    };
  },
  components: {
    PlayerTwitch,
    PlayerYoutube,
    Chatbox,
  },
};
</script>

<style lang="scss" scoped>
.panel-frames {
  height:100vh;
  overflow:hidden;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-rows: auto;
  padding:5px;
}
</style>
