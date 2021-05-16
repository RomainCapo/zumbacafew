import axios from 'axios'

axios.defaults.baseURL = "/api"

export default {
  name: "ArtistsAPI",
  getArtists() {
    return axios.get("/artists").then(result => result.data);
  },
  getTermFrequencyByArtist(artist) {
    return axios.get(`/artists/termfrequency/${artist}`).then(result => result.data);
  },
  getTermFrequencyByYear(word) {
    return axios.get(`/artists/termfrequencybyyear/${word}`).then(result => result.data);
  },
  getTerms() {
    return axios.get("/artists/terms/").then(result => result.data);
  },
  getTermFrequency() {
    return axios.get("/artists/termfrequency").then(result => result.data);
  },
  getStats() {
    return axios.get("/artists/stats").then(result => result.data);
  },
  getArtistCount(){
    return axios.get("/artists/artistcount").then(result => result.data);
  },
  getSongCount(){
    return axios.get("/artists/soundcount").then(result => result.data);
  },
  getWordCount(){
    return axios.get("/artists/wordcount").then(result => result.data);
  },
  getMinYear(){
    return axios.get("/artists/minyear").then(result => result.data);
  },
  getMaxYear(){
    return axios.get("/artists/maxyear").then(result => result.data);
  }
}
