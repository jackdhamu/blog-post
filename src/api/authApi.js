import axios from 'axios'

const BASE_URL = 'http://3.110.167.175/api'

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials)
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw { error: 'Unauthorized' }
      }
      throw error.response?.data || { error: 'Login failed' }
    }
  },

  signup: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData)
      return response.data
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors
      }
      throw error.response?.data || { error: 'Registration failed' }
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/logout`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Logout failed' }
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user data' }
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' }
    }
  }
} 