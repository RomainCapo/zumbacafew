import axios from 'axios'

// TODO : change for prod version
axios.defaults.baseURL = "http://localhost:8080/api/artists/"

export default {
  name: "ArtistsAPI",
  getTermFrequency () {
    return axios.get("/termfrequency").then(response => {
      return response.data
    })
  }
}
