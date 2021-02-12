import Vue from 'vue';

const VIDEO_CACHE = 15;
const TWEET_CACHE = 1800;

// Initialize cache
let channelsVer = 0;
let channels = {};
let videosTime = 0;
let videos = {};
let tweetsTime = 0;
let tweets = {};
let darkMode = {};
try {
  if (!localStorage.getItem('channelsVer')) localStorage.setItem('channelsVer', '0');
  if (!localStorage.getItem('channels')) localStorage.setItem('channels', '{}');
  if (!localStorage.getItem('videosTime')) localStorage.setItem('videosTime', '0');
  if (!localStorage.getItem('videos')) localStorage.setItem('videos', '{}');
  if (!localStorage.getItem('tweetsTime')) localStorage.setItem('tweetsTime', '0');
  if (!localStorage.getItem('tweets')) localStorage.setItem('tweets', '{}');
  if (!localStorage.getItem('darkMode')) localStorage.setItem('darkMode', '0');
  channelsVer = parseInt(localStorage.getItem('channelsVer'), 10) || 0;
  channels = JSON.parse(localStorage.getItem('channels'));
  videosTime = parseInt(localStorage.getItem('videosTime'), 10) || 0;
  videos = JSON.parse(localStorage.getItem('videos'));
  tweetsTime = parseInt(localStorage.getItem('tweetsTime'), 10) || 0;
  tweets = JSON.parse(localStorage.getItem('tweets'));
  darkMode = parseInt(localStorage.getItem('darkMode'), 10) === 1;
} catch (error) {
  console.error('Unable to initialize cache data.\n', error.message);
}

Vue.use({
  install: (VueInst) => {
    // eslint-disable-next-line no-param-reassign
    VueInst.prototype.$cache = {
      channelsVer,
      channels,
      videosTime,
      videos,
      tweetsTime,
      tweets,
      darkMode,
      getChannels(expectVer = null) {
        if (expectVer && parseInt(expectVer, 10) !== this.channelsVer) return null;
        if (!Object.keys(this.channels).length) return null;
        return this.channels;
      },
      setChannels(newChannelsVer, newChannels) {
        this.channelsVer = parseInt(newChannelsVer, 10);
        this.channels = newChannels;
        localStorage.setItem('channelsVer', newChannelsVer);
        localStorage.setItem('channels', JSON.stringify(newChannels));
      },
      getVideos() {
        if (Date.now() - this.videosTime > (VIDEO_CACHE * 1000)) return null;
        return this.videos;
      },
      setVideos(newVideos) {
        this.videosTime = Date.now();
        this.videos = newVideos;
        localStorage.setItem('videosTime', this.videosTime);
        localStorage.setItem('videos', JSON.stringify(newVideos));
      },
      getTweets() {
        if (Date.now() - this.tweetsTime > (TWEET_CACHE * 1000)) return null;
        return this.tweets;
      },
      setTweets(newTweets) {
        this.tweetsTime = Date.now();
        this.tweets = newTweets;
        localStorage.setItem('tweetsTime', this.tweetsTime);
        localStorage.setItem('tweets', JSON.stringify(newTweets));
      },
      getDarkMode() {
        return this.darkMode;
      },
      setDarkMode(isDark) {
        this.darkMode = isDark;
        localStorage.setItem('darkMode', this.darkMode ? '1' : '0');
      },
    };
  },
});
