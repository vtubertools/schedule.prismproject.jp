import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Watch from '../views/Watch.vue';
import Channel from '../views/Channel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/watch',
    name: 'Watch',
    component: Watch,
  },
  {
    path: '/c/:twitterName',
    name: 'Channel',
    component: Channel,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
