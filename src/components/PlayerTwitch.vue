<template>
  <div style="height:100%;">
    <iframe width="100%" height="100%" :src="videoSrc"></iframe>
  </div>
</template>

<script>

export default {
  name: 'PlayerTwitch',
  props: ['user'],
  data: () => ({
    //
  }),
  computed: {
    videoSrc() {
      return `https://player.twitch.tv/?channel=${this.user}&parent=${window.location.hostname}`;
    },
  },
  async mounted() {
    //
  },
};
</script>

<style lang="scss" scoped>
iframe {
  width:100%;
  height:100%;
  border:0px none;
}
</style>
