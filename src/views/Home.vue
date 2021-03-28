<template>
  <div class="home px-4 py-2">
    <div class="text-h6 ma-0 pa-0" v-if="hasLive">Live now</div>
    <v-container class="mx-0" v-if="hasLive">
      <v-row>
        <v-col v-for="(video, twitchName) in twitch" :key="video.key" @click="goWatch()"
          cols="12" xl="2" lg="3" md="4" sm="6">
          <Thumbnail
            :id="video.id"
            :twitch="twitchName"
            :image="video.image"
            :title="video.title"
            :game="video.game"
            :viewers="video.viewers"
            live="1" />
        </v-col>
        <v-col v-for="video in live" :key="video.key" @click="goWatch()"
          cols="12" xl="2" lg="3" md="4" sm="6">
          <Thumbnail
            :id="video.id"
            :channelId="video.channelId"
            :title="video.title"
            :start="video.start || video.scheduled"
            :viewers="video.viewers"
            live="1" />
        </v-col>
      </v-row>
    </v-container>

    <div class="text-h6 ma-0 pa-0" v-show="upcoming.length">Upcoming Streams</div>
    <v-container class="mx-0" v-show="upcoming.length">
      <v-row>
        <v-col v-for="video in upcoming" :key="video.key" cols="12" xl="2" lg="3" md="4" sm="6">
          <a :href="`https://www.youtube.com/watch?v=${video.id}`" target="_blank" class="video-link">
            <Thumbnail
              :id="video.id"
              :channelId="video.channelId"
              :title="video.title"
              :schedule="video.scheduled" />
          </a>
        </v-col>
      </v-row>
    </v-container>

    <div class="text-h6 ma-0 pa-0" v-show="Object.keys(tweets).length">Schedule Tweets</div>
    <v-container class="mx-0" v-show="Object.keys(tweets).length">
      <v-row>
        <v-col v-for="(tweet, twitterName) in tweets" :key="`tweet-${twitterName}`"
          cols="12" xl="2" lg="3" md="4" sm="6">
          <a :href="tweet.link" target="_blank">
            <v-img :src="tweet.image" />
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Thumbnail from '@/components/Thumbnail.vue';

export default {
  name: 'Home',
  data: () => ({
    //
  }),
  computed: {
    hasLive() {
      return Object.keys(this.twitch).length || this.live.length;
    },
    channels() {
      return this.$store.state.channels;
    },
    twitch() {
      return this.$store.state.twitch;
    },
    live() {
      return this.$store.state.live;
    },
    upcoming() {
      return this.$store.state.upcoming;
    },
    tweets() {
      return this.$store.state.tweets;
    },
  },
  methods: {
    goWatch() {
      this.$router.push({ name: 'Watch' }).catch(() => null);
    },
  },
  mounted() {
    if (!this.$isMobile) this.$store.dispatch('openDrawer');
  },
  components: {
    Thumbnail,
  },
};
</script>
