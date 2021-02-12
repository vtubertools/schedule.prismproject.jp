<template>
  <div class="channel">
    <div class="channel-background" :style="{ backgroundImage }"></div>
    <div class="channel-banner" :style="{ backgroundImage: bannerImage }">

    </div>
    <v-container class="channel-content">
      <v-row class="pa-4">
        <v-col cols="12" xl="2" lg="3" md="4" class="pa-2">
          <div class="channel-photo">
            <v-img :src="photoImage"></v-img>
          </div>
        </v-col>
        <v-col cols="12" xl="10" lg="9" md="8" class="pa-2">
          <v-list outlined dense color="rgba(255, 255, 255, 0.75)">
            <v-list-item two-line :href="!link.static ? link.value : undefined" target="_blank"
              v-for="link in links" :key="link.name">
              <v-list-item-icon class="pt-4">
                 <v-icon color="black">{{`mdi-${link.icon}`}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pt-2 pb-2 black--text">
                <v-list-item-title>{{link.name}}</v-list-item-title>
                <v-list-item-subtitle class="blue--text text-lighten-5">
                  {{link.value}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Channel',
  data: () => ({
    info: {},
    links: {},
  }),
  watch: {
    '$route.params': function paramsChange() {
      this.displayInfo();
    },
  },
  computed: {
    twitterName() {
      return this.$route.params.twitterName;
    },
    backgroundImage() {
      return `url('${this.info.banner}=w1707')`;
    },
    bannerImage() {
      return `url('${this.info.banner}=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj')`;
    },
    photoImage() {
      return this.info.image;
    },
  },
  methods: {
    displayNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    displayInfo() {
      this.info = Object.values(this.$store.state.channels)
        .find((channel) => channel.twitter === this.twitterName);
      if (!this.info) {
        this.$router.push({ name: 'Home' });
        return;
      }
      this.links = [];
      if (this.info.twitter) {
        this.links.push({
          icon: 'twitter',
          name: 'Twitter',
          value: `https://twitter.com/${this.info.twitter}`,
        });
      }
      if (this.info.youtube) {
        this.links.push({
          icon: 'youtube',
          name: 'YouTube',
          value: `https://www.youtube.com/channel/${this.info.youtube}`,
        });
      }
      if (this.info.twitch) {
        this.links.push({
          icon: 'twitch',
          name: 'Twitch',
          value: `https://www.twitch.tv/${this.info.twitch}`,
        });
      }
      if (this.info.discord) {
        this.links.push({
          icon: 'discord',
          name: 'Discord',
          value: this.info.discord,
        });
      }
      if (this.info.streamlabs) {
        this.links.push({
          icon: 'web',
          name: 'StreamLabs',
          value: this.info.streamlabs,
        });
      }
      if (this.info.marshmallow) {
        this.links.push({
          icon: 'web',
          name: 'Marshmallow Q&A',
          value: this.info.marshmallow,
        });
      }
      this.links.push({
        icon: 'account',
        name: 'YouTube Subscribers',
        value: this.displayNumber(this.info.subscribers),
        static: true,
      });
      this.links.push({
        icon: 'eye',
        name: 'YouTube Views',
        value: this.displayNumber(this.info.views),
        static: true,
      });
      this.links.push({
        icon: 'video',
        name: 'YouTube Videos',
        value: this.displayNumber(this.info.videos),
        static: true,
      });
    },
  },
  mounted() {
    if (!this.$isMobile) this.$store.dispatch('openDrawer');

    this.displayInfo();
  },
};
</script>

<style lang="scss" scoped>
.channel {
  position:relative;
  min-height:100vh;
  .channel-background {
    position:absolute;
    background-size:cover;
    background-position:center center;
    top:0; left:0; right:0; bottom:0;
    z-index:1;
    filter:blur(5px);
  }
  .channel-banner {
    height:282px;
    background-size:cover;
    background-position:center center;
    position:relative;
    z-index:2;
    border-bottom:2px solid #999;
  }
  .channel-content {
    position:relative;
    z-index:2;
    .channel-photo {
      border-radius:400px;
      overflow:hidden;
    }
  }
}
</style>
