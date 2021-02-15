<template>
  <v-app>
    <DataSync />
    <NavBar />
    <v-app-bar app v-if="$isMobile">
      <v-btn icon @click="goHome()" :style="{ opacity: atHome ? 0 : 1 }">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title @click="goHome()">
        <v-img src="@/assets/logo.png" contain height="40"></v-img>
      </v-toolbar-title>
      <v-btn href="https://twitter.com/PRISMproj" target="_blank" icon right>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-progress-circular :size="50"
        indeterminate color="blue darken-3"
        class="mt-8 mx-auto d-block"
        v-if="!dataReady">
      </v-progress-circular>
      <router-view v-if="dataReady"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import DataSync from '@/components/DataSync.vue';

export default {
  name: 'App',
  computed: {
    dataReady() {
      return this.$store.state.dataReady;
    },
    atHome() {
      return this.$route.name === 'Home';
    },
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' }).catch(() => null);
    },
  },
  components: {
    NavBar,
    DataSync,
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #e6e6e6;
  border-left: 1px solid #dadada;
}
::-webkit-scrollbar-thumb {
  background: #b0b0b0;
  border: solid 1px #e6e6e6;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: black;
}

.theme--dark {
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #202020;
    border-left: 1px solid #2c2c2c;
  }
  ::-webkit-scrollbar-thumb {
    background: #3e3e3e;
    border: solid 1px #202020;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: white;
  }
}

.v-navigation-drawer--mini-variant {
  .v-navigation-drawer__content {
    overflow-y: hidden;
  }
}
</style>
