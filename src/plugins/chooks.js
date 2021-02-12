import Vue from 'vue';
import axios from 'axios';
import url from 'url';

class ChooksAPI {
  // eslint-disable-next-line class-methods-use-this
  buildUrl(route) {
    return url.format({
      protocol: 'https',
      host: 'api.chooks.app',
      pathname: route,
    });
  }

  async request(route, query) {
    const result = await axios.post(this.buildUrl(route), { query })
      .catch(() => null);
    return result?.data?.data || null;
  }

  async getChannels() {
    const data = await this.request('/v1/channels', `
      {
        channels(organizations:["tsunderia"]) {
          items {
            channel_id,
            channel_name,
            name {
              en,
              jp
            },
            thumbnail,
            details,
            channel_stats {
              published_at,
              views,
              subscribers,
              videos,
            },
          }
        }
      }
    `);
    return data?.channels?.items || [];
  }

  async getLivestreams() {
    const data = await this.request('/v1/live', `
      {
        live(organizations:["tsunderia"]) {
          _id,
          organization,
          title,
          channel_id,
          time {
            scheduled,
            start
          },
          status,
          viewers,
        }
      }
    `);
    return data?.live || [];
  }

  async getScheduled() {
    const data = await this.request('/v1/videos', `
      {
        videos(organizations:["tsunderia"], status:upcoming) {
          items {
            _id,
            organization,
            title,
            channel_id,
            time {
              scheduled,
              start
            },
            status
          }
        }
      }
    `);
    return data?.videos?.items || [];
  }

  async getFeature() {
    const data = await this.request('/v1/videos', `
      {
        videos(organizations:["tsunderia"], status:[upcoming, live]) {
          items {
            _id,
            platform_id,
            title,
            channel_id,
            time {
              published,
              scheduled,
              start
            },
            status,
            viewers,
          }
        }
      }
    `);
    return data?.videos?.items || [];
  }
}

Vue.use({
  install: (VueInst) => {
    // eslint-disable-next-line no-param-reassign
    VueInst.prototype.$chooks = new ChooksAPI();
  },
});
