import Vue from 'vue';

const PREFIX = 'prism';
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
  if (!localStorage.getItem(`${PREFIX}_channelsVer`)) localStorage.setItem(`${PREFIX}_channelsVer`, '0');
  if (!localStorage.getItem(`${PREFIX}_channels`)) localStorage.setItem(`${PREFIX}_channels`, '{}');
  if (!localStorage.getItem(`${PREFIX}_videosTime`)) localStorage.setItem(`${PREFIX}_videosTime`, '0');
  if (!localStorage.getItem(`${PREFIX}_videos`)) localStorage.setItem(`${PREFIX}_videos`, '{}');
  if (!localStorage.getItem(`${PREFIX}_tweetsTime`)) localStorage.setItem(`${PREFIX}_tweetsTime`, '0');
  if (!localStorage.getItem(`${PREFIX}_tweets`)) localStorage.setItem(`${PREFIX}_tweets`, '{}');
  if (!localStorage.getItem(`${PREFIX}_darkMode`)) localStorage.setItem(`${PREFIX}_darkMode`, '0');
  channelsVer = parseInt(localStorage.getItem(`${PREFIX}_channelsVer`), 10) || 0;
  channels = JSON.parse(localStorage.getItem(`${PREFIX}_channels`));
  videosTime = parseInt(localStorage.getItem(`${PREFIX}_videosTime`), 10) || 0;
  videos = JSON.parse(localStorage.getItem(`${PREFIX}_videos`));
  tweetsTime = parseInt(localStorage.getItem(`${PREFIX}_tweetsTime`), 10) || 0;
  tweets = JSON.parse(localStorage.getItem(`${PREFIX}_tweets`));
  darkMode = parseInt(localStorage.getItem(`${PREFIX}_darkMode`), 10) === 1;
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
        localStorage.setItem(`${PREFIX}_channelsVer`, newChannelsVer);
        localStorage.setItem(`${PREFIX}_channels`, JSON.stringify(newChannels));
      },
      getVideos() {
        if (Date.now() - this.videosTime > (VIDEO_CACHE * 1000)) return null;
        return this.videos;
      },
      setVideos(newVideos) {
        this.videosTime = Date.now();
        this.videos = newVideos;
        localStorage.setItem(`${PREFIX}_videosTime`, this.videosTime);
        localStorage.setItem(`${PREFIX}_videos`, JSON.stringify(newVideos));
      },
      getTweets() {
        if (Date.now() - this.tweetsTime > (TWEET_CACHE * 1000)) return null;
        return this.tweets;
      },
      setTweets(newTweets) {
        this.tweetsTime = Date.now();
        this.tweets = newTweets;
        localStorage.setItem(`${PREFIX}_tweetsTime`, this.tweetsTime);
        localStorage.setItem(`${PREFIX}_tweets`, JSON.stringify(newTweets));
      },
      getDarkMode() {
        return this.darkMode;
      },
      setDarkMode(isDark) {
        this.darkMode = isDark;
        localStorage.setItem(`${PREFIX}_darkMode`, this.darkMode ? '1' : '0');
      },
    };
  },
});
