import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://shielded-everglades-57170.herokuapp.com'
})

export default instance
