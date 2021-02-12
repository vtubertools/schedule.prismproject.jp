<template>
  <div :class="['video-box', live?'video-live':'', twitch?'twitch':'']" :title="title">
    <div class="video-image" v-if="channelId">
      <img referrerPolicy="no-referrer" class="d-block"
        :src="`https://i.ytimg.com/vi/${id}/mqdefault.jpg`">
      <div class="video-avatar">
        <img referrerPolicy="no-referrer" class="d-block"
          :src="channels[channelId] ? (channels[channelId].image || '') : ''">
      </div>
    </div>
    <div class="video-image" v-if="twitch">
      <img referrerPolicy="no-referrer" class="d-block" :src="image">
      <div class="video-avatar">
        <img referrerPolicy="no-referrer" class="d-block"
          :src="channelsTwitch[twitch] ? (channelsTwitch[twitch].image || '') : ''">
      </div>
    </div>
    <div :class="titleClass">{{title}}</div>
    <div class="video-relative grey--text text--darken-1" v-if="game">
      <v-icon small color="grey">mdi-gamepad-variant-outline</v-icon>
      {{game}}
    </div>
    <div class="video-absolute grey--text text--darken-1" v-if="start">
      <v-icon small color="grey">mdi-alarm</v-icon>
      {{startTime}}
    </div>
    <div class="video-absolute red--text text--darken-1" v-if="viewers">
      <v-icon small color="red">mdi-eye</v-icon>
      {{viewers}}
    </div>
    <div class="video-relative blue--text text--darken-1" v-if="!live">{{relativeTime}}</div>
    <div class="video-absolute grey--text text--darken-1" v-if="!live">{{displayTime}}</div>
  </div>
</template>

<script>
import moment from 'moment-timezone';

export default {
  name: 'Thumbnail',
  props: ['id', 'twitch', 'channelId', 'title', 'image', 'game', 'start', 'viewers', 'schedule', 'live'],
  data: () => ({
    startTime: '',
    relativeTime: '',
    displayTime: '',
  }),
  computed: {
    channels() {
      return this.$store.state.channels;
    },
    channelsTwitch() {
      return this.$store.state.channelsTwitch;
    },
    titleClass() {
      return 'video-title grey--text'.split(',')
        .concat([!this.isDark ? 'text--darken-4' : 'text--lighten-1']);
    },
    isDark() {
      return this.$vuetify.theme.dark;
    },
  },
  mounted() {
    if (this.schedule) {
      const startMoment = moment.unix(this.schedule);
      this.relativeTime = startMoment.fromNow();
      this.displayTime = startMoment.format('ddd MMM D, hh:mm A');
    }
    if (this.start) {
      this.startTime = moment.utc(moment().diff(moment.unix(this.start))).format('HH:mm:ss');
    }
  },
};
</script>

<style lang="scss" scoped>
.video-box {
  a.video-link & {
    text-decoration: none;
  }
  width:100%;
  position:relative;
  cursor: pointer;
  &.video-live {
    cursor:pointer;
    .video-image {
      border:2px solid #ff0000;
      box-shadow: 0px 0px 3px #ff0000;
    }
    .video-avatar {
      border-color: #ff0000;
    }
    .video-mobilepic {
      border-color: #ff0000;
    }
    &.twitch {
      .video-image {
        border:2px solid #6441a5;
        box-shadow: 0px 0px 3px #6441a5;
      }
      .video-avatar {
        border-color: #6441a5;
      }
      .video-mobilepic {
        border-color: #6441a5;
      }
    }
  }
  .video-image {
    width:100%;
    // max-width:192px;
    margin:0px auto 7px;
    position:relative;
    img {
      width:100%;
      height:auto;
      // max-height:108px;
    }
  }
  .video-avatar {
    width:60px;
    height:60px;
    position:absolute;
    left:-10px;
    bottom:10px;
    border-radius:30px;
    border:2px solid #000;
    overflow:hidden;
    img {
      width:56px;
      height:56px;
    }
  }
  .video-title {
    width:100%;
    // max-height:35px;
    // font-size:14px;
    // line-height:18px;
    overflow:hidden;
    // max-width: 200px;
    margin: 0px auto 3px;
    text-align:center;
  }
  .video-relative {
    // height:16px;
    // font-size:14px;
    // line-height:16px;
    overflow:hidden;
    text-align:center;
  }
  .video-absolute {
    // height:16px;
    // font-size:14px;
    // line-height:16px;
    overflow:hidden;
    text-align:center;
  }
}
</style>
