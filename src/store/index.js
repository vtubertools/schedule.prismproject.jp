import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: null,
    dataReady: false,
    channels: {},
    channelsTwitch: {},
    twitch: [],
    live: [],
    upcoming: [],
    tweets: {},
    wantChat: false,
    watching: {},
  },
  mutations: {
    drawer(state, data) { state.drawer = data; },
    dataReady(state, data) { state.dataReady = data; },
    channels(state, data) { state.channels = data; },
    channelsTwitch(state, data) { state.channelsTwitch = data; },
    twitch(state, data) { state.twitch = data; },
    live(state, data) { state.live = data; },
    upcoming(state, data) { state.upcoming = data; },
    tweets(state, data) { state.tweets = data; },
    wantChat(state, data) { state.wantChat = data; },
    watching(state, data) { state.watching = { ...data }; },
  },
  actions: {
    openDrawer({ commit }) {
      commit('drawer', true);
    },
    closeDrawer({ commit }) {
      commit('drawer', false);
    },
    toggleDrawer({ commit, state }) {
      commit('drawer', !state.drawer);
    },
    dataReady({ commit }) {
      commit('dataReady', true);
    },
    setChannels({ commit }, data) {
      commit('channels', data);
      const channelsTwitch = {};
      Object.values(data).forEach((channel) => {
        channelsTwitch[channel.twitch] = channel;
      });
      commit('channelsTwitch', channelsTwitch);
    },
    setTwitch({ commit }, data) {
      commit('twitch', data);
    },
    setLive({ commit }, data) {
      commit('live', data);
    },
    setUpcoming({ commit }, data) {
      commit('upcoming', data);
    },
    setTweets({ commit }, data) {
      commit('tweets', data);
    },
    toggleChat({ commit, state }) {
      commit('wantChat', !state.wantChat);
    },
    openChat({ commit }) {
      commit('wantChat', true);
    },
    closeChat({ commit }) {
      commit('wantChat', false);
    },
    openTwitch({ commit, state }, { video }) {
      state.watching[`tw-${video.username}`] = video;
      commit('watching', state.watching);
    },
    closeTwitch({ commit, state }, { username }) {
      delete state.watching[`tw-${username}`];
      commit('watching', state.watching);
    },
    openYoutube({ commit, state }, { video }) {
      state.watching[`yt-${video.id}`] = video;
      commit('watching', state.watching);
    },
    closeYoutube({ commit, state }, { videoId }) {
      delete state.watching[`yt-${videoId}`];
      commit('watching', state.watching);
    },
    openAllVideos({ commit, state }) {
      Object.values(state.twitch).forEach((video) => {
        state.watching[`tw-${video.username}`] = video;
      });
      state.live.forEach((video) => {
        state.watching[`yt-${video.id}`] = video;
      });
      commit('watching', state.watching);
    },
  },
});
