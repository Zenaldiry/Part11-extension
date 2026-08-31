/* global window, localStorage */
import axios from 'axios'
const baseUrl = '/api/login'
const login = async (user) => {
  const response = await axios.post(baseUrl, user)
  window.localStorage.setItem('loggedBlogUser', JSON.stringify(response.data))
  return response.data
}

export default login
