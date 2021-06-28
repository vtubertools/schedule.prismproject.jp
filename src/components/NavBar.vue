<template>
  <div style="overflow-y:hidden;">
    <v-navigation-drawer app width="280"
      v-model="drawer"
      permanent
      :mini-variant="!drawer"
      disable-resize-watcher
      disable-route-watcher
      v-if="!$isMobile">
      <div class="pt-2 pl-2 pr-2">
        <!-- LOGO -->
        <div class="logo-area">
          <div class="pb-2" v-show="!drawer" @click="drawer = !drawer">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </div>
          <div class="pl-12 pr-4 pb-4" v-show="drawer" @click="goHome()">
            <v-img src="@/assets/logo.png" contain height="100"></v-img>
          </div>
          <div class="pb-2" v-show="!drawer" @click="goHome()">
            <v-img src="@/assets/logo-32.png"></v-img>
          </div>
          <div class="wide-menu-toggle" v-show="drawer" @click="drawer = !drawer">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </div>
        </div>
        <v-divider></v-divider>

        <v-list>
          <v-list-item class="stream-entry pr-1 px-0 py-0 pl-2" @click="goHome()">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pt-2 pb-2">
              Schedule
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <!-- LIVE -->
        <div class="section-header subtitle-2 red--text pt-4" v-show="drawer && hasLive">
          LIVE NOW
          <span class="section-button blue--text pr-2" @click="goWatch()">Watch</span>
        </div>
        <v-list class="pb-4" v-show="hasLive">
          <v-list-item :two-line="drawer"
            :class="'stream-entry pr-1 px-0 py-0'.split(' ').concat([ drawer?'pl-2':'pl-0' ])"
            v-for="(video, twitchName) in twitch" :key="video.key"
            @click="toggleTwitch(video)">
            <v-list-item-avatar class="my-0">
              <img referrerPolicy="no-referrer"
                :src="channelsTwitch[twitchName] ? (channelsTwitch[twitchName].image || '') : ''">
            </v-list-item-avatar>
            <v-list-item-content class="pt-2 pb-2">
              <v-list-item-title>
                {{channelsTwitch[twitchName] ? (channelsTwitch[twitchName].name || '') : ''}}
              </v-list-item-title>
              <v-list-item-subtitle>{{video.title}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-badge color="#6441a5" dot inline></v-badge>
          </v-list-item>
          <v-list-item :two-line="drawer"
            :class="'stream-entry pr-1 px-0 py-0'.split(' ').concat([ drawer?'pl-2':'pl-0' ])"
            v-for="video in live" :key="video.key"
            @click="toggleYoutube(video)">
            <v-list-item-avatar class="my-0">
              <img referrerPolicy="no-referrer"
                :src="channels[video.channelId] ? (channels[video.channelId].image || '') : ''">
            </v-list-item-avatar>
            <v-list-item-content class="pt-2 pb-2">
              <v-list-item-title>
                {{channels[video.channelId] ? (channels[video.channelId].name || '') : ''}}
              </v-list-item-title>
              <v-list-item-subtitle>{{video.title}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-badge color="red" dot inline></v-badge>
          </v-list-item>
          <!-- CONTROLS -->
          <!-- <v-list-item
            :class="'stream-control ma-0 pa-0 pt-2 pb-1 text-center'.split(' ')
              .concat([ drawer ? 'pl-4' : 'pl-0' ])"
            v-show="atWatch && !drawer"
            @click="">
            <v-list-item-icon class="pa-0 my-0 mx-auto">
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pa-0 my-0 mx-auto pl-2">
              Add video
            </v-list-item-content>
          </v-list-item> -->
          <!-- <v-list-item
            :class="'stream-control ma-0 pa-0 pt-2 pb-1 text-center'.split(' ')
              .concat([ drawer ? 'pl-4' : 'pl-0' ])"
            v-show="atWatch && !drawer"
            @click="">
            <v-list-item-icon class="pa-0 my-0 mx-auto">
              <v-icon>mdi-grid</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pa-0 my-0 mx-auto pl-2">
              Change Layout
            </v-list-item-content>
          </v-list-item> -->
          <v-list-item
            :class="'stream-control ma-0 pa-0 pt-2 pb-1 text-center'.split(' ')
              .concat([ drawer ? 'pl-4' : 'pl-0' ])"
            v-show="atWatch && !drawer"
            @click="toggleChat()">
            <v-list-item-icon class="pa-0 my-0 mx-auto">
              <v-icon>mdi-chat</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pa-0 my-0 mx-auto pl-2">
              Toggle Chat
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item
            :class="'stream-control ma-0 pa-0 pt-2 pb-1 text-center'.split(' ')
              .concat([ drawer ? 'pl-4' : 'pl-0' ])"
            v-show="atWatch && !drawer"
            @click="">
            <v-list-item-icon class="pa-0 my-0 mx-auto">
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pa-0 my-0 mx-auto pl-2">
              Screen Settings
            </v-list-item-content>
          </v-list-item> -->
        </v-list>
        <v-divider v-show="hasLive"></v-divider>

        <!-- SCHEDULED -->
        <!-- <div class="section-header subtitle-2 grey--text pt-4" v-show="drawer && upcoming.length">
          SCHEDULED
          <span class="section-button blue--text pr-2" @click="goHome()">View all</span>
        </div>
        <v-list class="pb-4" v-show="drawer && upcoming.length">
          <v-list-item :two-line="drawer"
            :class="'stream-entry pr-1 px-0 py-0'.split(' ').concat([ drawer?'pl-2':'pl-0' ])"
            v-for="video in upcoming" :key="video.key"
            @click="goHome()">
            <v-list-item-avatar class="my-0">
              <img referrerPolicy="no-referrer"
                :src="channels[video.channelId] ? (channels[video.channelId].image || '') : ''">
            </v-list-item-avatar>
            <v-list-item-content class="pt-2 pb-2">
              <v-list-item-title>
                {{channels[video.channelId] ? (channels[video.channelId].name || '') : ''}}
              </v-list-item-title>
              <v-list-item-subtitle>{{video.title}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-badge :content="video.badge" color="black--text blue lighten-4" inline></v-badge>
          </v-list-item>
        </v-list>
        <v-divider v-show="drawer && upcoming.length"></v-divider> -->

        <!-- CHANNELS -->
        <div class="section-header section-menu subtitle-2 grey--text pt-4" v-show="drawer">
          FIRST GENERATION
        </div>
        <v-expand-transition>
          <v-list v-show="drawer">
            <v-list-item
              :class="'stream-entry pr-1 py-0'.split(' ').concat([ drawer ? 'pl-2' : 'pl-0' ])"
              v-for="channel in displayChannels1" :key="channel.id"
              @click="goChannel(channel.twitter)">
              <v-list-item-avatar class="my-0">
                <img :src="channel.image" referrerPolicy="no-referrer">
              </v-list-item-avatar>
              <v-list-item-content class="pt-2 pb-2">
                <v-list-item-title>{{channel.name}}</v-list-item-title>
                <!-- <v-list-item-subtitle>
                  {{displayNumber(channel.subscribers)}} subscribers
                </v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
        <div class="pt-4"></div>
        <v-divider v-show="drawer"></v-divider>

        <div class="section-header section-menu subtitle-2 grey--text pt-4" v-show="drawer">
          SECOND GENERATION
        </div>
        <v-expand-transition>
          <v-list v-show="drawer">
            <v-list-item
              :class="'stream-entry pr-1 py-0'.split(' ').concat([ drawer ? 'pl-2' : 'pl-0' ])"
              v-for="channel in displayChannels2" :key="channel.id"
              @click="goChannel(channel.twitter)">
              <v-list-item-avatar class="my-0">
                <img :src="channel.image" referrerPolicy="no-referrer">
              </v-list-item-avatar>
              <v-list-item-content class="pt-2 pb-2">
                <v-list-item-title>{{channel.name}}</v-list-item-title>
                <!-- <v-list-item-subtitle>
                  {{displayNumber(channel.subscribers)}} subscribers
                </v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
        <div class="pt-4"></div>
        <v-divider v-show="drawer"></v-divider>

        <div class="section-header section-menu subtitle-2 grey--text pt-4" v-show="drawer">
          THIRD GENERATION
        </div>
        <v-expand-transition>
          <v-list v-show="drawer">
            <v-list-item
              :class="'stream-entry pr-1 py-0'.split(' ').concat([ drawer ? 'pl-2' : 'pl-0' ])"
              v-for="channel in displayChannels3" :key="channel.id"
              @click="goChannel(channel.twitter)">
              <v-list-item-avatar class="my-0">
                <img :src="channel.image" referrerPolicy="no-referrer">
              </v-list-item-avatar>
              <v-list-item-content class="pt-2 pb-2">
                <v-list-item-title>{{channel.name}}</v-list-item-title>
                <!-- <v-list-item-subtitle>
                  {{displayNumber(channel.subscribers)}} subscribers
                </v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
        <div class="pt-4"></div>
        <v-divider v-show="drawer"></v-divider>

        <!-- TOGGLE DARK MODE -->
        <v-list>
          <v-list-item class="stream-entry pr-1 px-0 py-0 pl-2" @click="toggleDarkMode()">
            <v-list-item-icon>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pt-2 pb-2">
              Toggle Dark Mode
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <!-- LEARN MORE -->
        <div class="learn-more text-center text-body-2 grey--text mt-4 mb-4" v-show="drawer">
          <a href="https://twitter.com/PRISMproj" target="_blank">Learn more about PRISM Project</a>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data: () => ({
    drawer: null,
    displayChannels1: [],
    displayChannels2: [],
    displayChannels3: [],
    showMenu: false,
    gens: {
      UC2hWFlqMew61Jy6A8zu5HzQ: 1,
      UCRWF6QSuklmwY3UJHyVTQ1w: 1,
      UCZfQRuwSLty74QAj55BaKlA: 1,
      UCnYhIk9aGEx_bIgheVjs53w: 2,
      UCBJFsaCvgBa1a9BnEaxu97Q: 2,
      'UCswvd6_YWmd6riRk-8oT-sA': 3,
      UCw1KNjVqfrJSfcFd6zlcSzA: 3,
      'UCpeRj9-GaLGNUoKdI5I7vZA': 3,
      UC0ZTVxCHkZanT5dnP2FZD4Q: 3,
    },
  }),
  watch: {
    drawer(val) {
      if (val !== this.$drawer) {
        this.$store.dispatch('toggleDrawer');
      }
    },
    $drawer(val) {
      this.drawer = val;
    },
    channels(val) {
      this.displayChannels = [];
      Object.keys(val).forEach((channelKey) => {
        console.log('channelKey', channelKey);
        const gen = this.gens[channelKey];
        this[`displayChannels${gen}`].push({
          id: channelKey,
          image: val[channelKey].image,
          name: val[channelKey].name,
          published: val[channelKey].published,
          subscribers: val[channelKey].subscribers,
          twitter: val[channelKey].twitter,
        });
      });
      this.displayChannels1 = this.displayChannels1.sort((a, b) => {
        if (a.published > b.published) return 1;
        if (a.published < b.published) return -1;
        return 0;
      });
      this.displayChannels2 = this.displayChannels2.sort((a, b) => {
        if (a.published > b.published) return 1;
        if (a.published < b.published) return -1;
        return 0;
      });
      this.displayChannels3 = this.displayChannels3.sort((a, b) => {
        if (a.published > b.published) return 1;
        if (a.published < b.published) return -1;
        return 0;
      });
    },
  },
  computed: {
    hasLive() {
      return Object.keys(this.twitch).length || this.live.length;
    },
    $drawer() {
      return this.$store.state.drawer;
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
    upcoming() {
      return this.$store.state.upcoming;
    },
    // atHome() {
    //   return this.$route.name === 'Home';
    // },
    atWatch() {
      return this.$route.name === 'Watch';
    },
  },
  methods: {
    displayNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    goWatch() {
      if (!this.atWatch) this.$router.push({ name: 'Watch' }).catch(() => null);
    },
    toggleTwitch(video) {
      if (!this.$store.state.watching[`tw-${video.username}`]) {
        this.$store.dispatch('openTwitch', { video });
      } else {
        this.$store.dispatch('closeTwitch', { username: video.username });
      }
      this.goWatch();
    },
    toggleYoutube(video) {
      if (!this.$store.state.watching[`yt-${video.id}`]) {
        this.$store.dispatch('openYoutube', { video });
      } else {
        this.$store.dispatch('closeYoutube', { videoId: video.id });
      }
      this.goWatch();
    },
    goHome() {
      this.$router.push({ name: 'Home' }).catch(() => null);
    },
    goChannel(twitterName) {
      this.$router.push({ name: 'Channel', params: { twitterName } }).catch(() => null);
    },
    toggleChat() {
      this.$store.dispatch('toggleChat');
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$cache.setDarkMode(this.$vuetify.theme.dark);
    },
  },
  mounted() {
    if (this.$cache.getDarkMode()) {
      this.$vuetify.theme.dark = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.logo-area {
  position:relative;
  cursor:pointer;
  .wide-menu-toggle {
    position:absolute;
    top:5px;
    left:5px;
  }
}
.section-header {
  font-size:12px;
  font-weight:bold;
  &.section-menu {
    cursor:pointer;
  }
  .section-button {
    float:right;
    cursor:pointer;
  }
}
.stream-entry {
  min-height:50px;
  border-radius:12px;
  cursor:pointer;
  &:hover {
    background:rgba(0,0,0,0.2);
  }
}
.stream-control {
  min-height:30px;
  border-radius:12px;
  cursor:pointer;
  &:hover {
    background:rgba(0,0,0,0.2);
  }
}
.learn-more {
  a {
    text-decoration: none;
  }
}
</style>
