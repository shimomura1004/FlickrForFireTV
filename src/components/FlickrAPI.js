import axios from 'axios'

export default {
  methods: {
    getRequest (params) {
      return axios.get('/service/rest', {params: params})
    }
  }
}
