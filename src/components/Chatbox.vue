<template>
  <div class="chatbox">
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-btn block elevation="0" v-bind="attrs" v-on="on">
          <v-icon left>mdi-chat</v-icon>
          {{ currentChat ? 'Switch Chat': 'Open Chat' }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(video, twitchName) in twitch" :key="video.key"
          @click="showTwitchChat(twitchName, video.title)">
          <v-list-item-avatar class="my-0">
            <img referrerPolicy="no-referrer"
              :src="channelsTwitch[twitchName] ? (channelsTwitch[twitchName].image || '') : ''">
          </v-list-item-avatar>
          <v-list-item-content class="pt-2 pb-2">
            <v-list-item-title>
              {{channelsTwitch[twitchName] ? (channelsTwitch[twitchName].name || '') : ''}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="video in live" :key="video.key"
          @click="showYoutubeChat(video)">
          <v-list-item-avatar class="my-0">
            <img referrerPolicy="no-referrer"
              :src="channels[video.channelId] ? (channels[video.channelId].image || '') : ''">
          </v-list-item-avatar>
          <v-list-item-content class="pt-2 pb-2">
            <v-list-item-title>
              {{channels[video.channelId] ? (channels[video.channelId].name || '') : ''}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <div>
      <v-list v-if="currentChat">
        <v-list-item>
          <v-list-item-avatar class="my-0" v-if="currentChat">
            <img referrerPolicy="no-referrer" :src="currentChat.image">
          </v-list-item-avatar>
          <v-list-item-content class="pt-2 pb-2">
            <v-list-item-title>{{currentChat.name}}</v-list-item-title>
            <v-list-item-subtitle>{{currentChat.title}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div class="chat-frame">
      <iframe :src="twitchFrameSrc" v-if="twitchFrameSrc"></iframe>
      <iframe :src="youtubeFrameSrc" v-if="youtubeFrameSrc"></iframe>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Chatbox',
  data: () => ({
    currentChat: null,
    twitchFrameSrc: null,
    youtubeFrameSrc: null,
  }),
  computed: {
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
  },
  methods: {
    showYoutubeChat(video) {
      this.currentChat = this.channels[video.channelId];
      this.currentChat.title = video.title;
      this.currentChat.color = '#ff0000';
      this.twitchFrameSrc = null;
      this.youtubeFrameSrc = `https://www.youtube.com/live_chat?v=${video.id}&embed_domain=${window.location.hostname}`;
    },
    showTwitchChat(twitchName, title) {
      this.currentChat = this.channelsTwitch[twitchName];
      this.currentChat.title = title;
      this.currentChat.color = '#6441a5';
      this.twitchFrameSrc = `https://www.twitch.tv/embed/${twitchName}/chat?parent=${window.location.hostname}`;
      this.youtubeFrameSrc = null;
      console.log(this.twitchFrameSrc);
    },
  },
  mounted() {
    // if (Object.keys(this.twitch).length) {
    //   const firstTwitchName = Object.keys(this.twitch)[0];
    //   const firstTwitchVideo = this.twitch[firstTwitchName];
    //   this.showTwitchChat(firstTwitchName, firstTwitchVideo.title);
    // } else if (this.live.length) {
    //   this.showYoutubeChat(this.live[0]);
    // }
  },
};
</script>

<style lang="scss" scoped>
.chatbox {
  height:100vh;
  overflow-y:hidden;
}
.chat-frame {
  width:100%;
  height:calc(100vh - 110px);
  iframe {
    width:100%;
    height:100%;
    border:0px none;
  }
}
</style>
