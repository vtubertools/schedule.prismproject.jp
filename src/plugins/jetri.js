import Vue from 'vue';
import axios from 'axios';
import url from 'url';

class JetriAPI {
  // eslint-disable-next-line class-methods-use-this
  buildUrl(file) {
    return url.format({
      protocol: 'https',
      host: 'vtubertools.sfo3.digitaloceanspaces.com',
      pathname: `/prismproject/${file}.json`,
    });
  }

  // channels
  // twitch
  // twitter
  // youtube
  async get(file) {
    try {
      const result = await axios.get(this.buildUrl(file));
      if (!result || !result.data) throw new Error();
      return typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    } catch (error) {
      console.warn(`Unable to fetch ${file} from JetriAPI`);
      return null;
    }
  }
}

Vue.use({
  install: (VueInst) => {
    // eslint-disable-next-line no-param-reassign
    VueInst.prototype.$jetri = new JetriAPI();
  },
});
