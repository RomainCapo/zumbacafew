import axios from 'axios'

// TODO : change for prod version
axios.defaults.baseURL = process.env.VUE_APP_BACKENDURL;

export default {
  name: "ArtistsAPI",
  getTermFrequency () {
    return axios.get("/artists/termfrequency").then(result => result.data);
  }
}
