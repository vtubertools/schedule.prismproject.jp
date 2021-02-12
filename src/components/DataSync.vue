<template>
  <div></div>
</template>

<script>
import moment from 'moment-timezone';

const VIDEO_REFRESH = 120;

export default {
  name: 'DataSync',
  data: () => ({
    refreshMs: null,
    dataReady: false,
    videos: {
      twitch: {},
      youtube: {},
    },
    channelVer: 1,
  }),
  methods: {
    async loadChannels() {
      let channels = this.$cache.getChannels(this.channelVer);
      if (!channels) {
        channels = {};
        const results = await this.$jetri.get('channels');
        console.warn('REQUEST CHANNELS', results);
        Object.values(results).forEach((channel) => {
          channels[channel.youtube] = channel;
          // channels[`yt-${channel.youtube}`] = channel;
          // channels[`tw-${channel.twitter}`] = channel;
          // channels[`tt-${channel.twitch}`] = channel;
        });
        this.$cache.setChannels(this.channelVer, channels);
      }
      this.$store.dispatch('setChannels', channels);
    },
    async loadTwitter() {
      let tweets = this.$cache.getTweets();
      if (!tweets) {
        tweets = await this.$jetri.get('twitter');
        console.warn('REQUEST TWEETS', tweets);
        this.$cache.setTweets(tweets);
      }
      this.$store.dispatch('setTweets', tweets);
    },
    async loadVideos() {
      this.videos = this.$cache.getVideos();
      if (!this.videos) {
        const results = await Promise.all([
          this.$jetri.get('twitch'),
          this.$jetri.get('youtube'),
          // Promise.resolve(sampleTwitch),
          // Promise.resolve(sampleYoutube),
        ]);
        this.videos = {
          twitch: results[0],
          live: results[1].live,
          upcoming: results[1].upcoming
            .sort((a, b) => {
              const aTime = a.start || a.scheduled || a.published;
              const bTime = b.start || b.scheduled || b.published;
              if (aTime > bTime) return 1;
              if (aTime < bTime) return -1;
              return 0;
            }),
        };
        // Add twitch username to its own object
        Object.keys(this.videos.twitch).forEach((username) => {
          this.videos.twitch[username].username = username;
        });
        console.warn('REQUEST VIDEOS', this.videos);
        this.$cache.setVideos(this.videos);
      }
      this.refreshVideos();
    },
    refreshVideos() {
      if (!this.videos) return;
      // Re-distribute upcoming videos to live based on schedule
      let live = this.videos ? this.videos.live : [];
      const upcoming = [];
      this.videos.upcoming.forEach((video) => {
        const nowMoment = moment();
        const scheduleMoment = moment.unix(video.scheduled);
        if (scheduleMoment.isBefore(nowMoment)) {
          live.push(video);
        } else {
          const remainMins = scheduleMoment.diff(nowMoment, 'minute');
          let remainText;
          if (remainMins > 1440) remainText = `${Math.floor(remainMins / 1440)}d`;
          else if (remainMins >= 60) remainText = `${Math.floor(remainMins / 60)}h`;
          else remainText = `${remainMins}m`;
          // eslint-disable-next-line no-param-reassign
          video.badge = remainText;
          upcoming.push(video);
        }
      });
      // Unique live
      live = [...new Map(live.map((video) => [video.id, video])).values()];
      // Save videos into global store
      this.$store.dispatch('setTwitch', this.videos.twitch);
      this.$store.dispatch('setLive', live);
      this.$store.dispatch('setUpcoming', upcoming);
      // Dispatch dataReady action
      if (!this.dataReady) this.$store.dispatch('dataReady');
      this.dataReady = true;
    },
    timerNetwork() {
      // Schedule next interval
      const nextMoment = moment().add(VIDEO_REFRESH, 'second').second(0).millisecond(this.refreshMs);
      const nextMillis = nextMoment.diff(moment(), 'millisecond');
      setTimeout(this.timerNetwork, nextMillis);
      // Do the network requests
      this.loadVideos();
    },
    timerRefresh() {
      // Schedule next interval
      const nextMoment = moment().add(1, 'minute').second(0).millisecond(100);
      const nextMillis = nextMoment.diff(moment(), 'millisecond');
      setTimeout(this.timerRefresh, nextMillis);
      // Do the refreshes
      this.refreshVideos();
    },
  },
  async mounted() {
    await this.loadChannels();
    this.loadTwitter();

    // Determine a random network millisecond
    this.refreshMs = Math.floor(Math.random() * 51000) + 5000;

    // Start the timers
    this.timerNetwork();
    this.timerRefresh();
  },
};
</script>
