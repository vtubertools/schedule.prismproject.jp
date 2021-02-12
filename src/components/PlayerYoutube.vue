<template>
  <div style="height:100%;">
    <iframe width="100%" height="100%" :src="videoSrc"></iframe>
  </div>
</template>

<script>

export default {
  name: 'PlayerYoutube',
  props: ['videoId'],
  data: () => ({
    //
  }),
  computed: {
    videoSrc() {
      return `https://www.youtube.com/embed/${this.videoId}`;
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
