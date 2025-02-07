import axios from 'axios'
import { getAuthHeader } from './authUtils'

const BASE_URL = 'https://stories.techzilla.site/api'

export const authorsApi = {
  // Get all authors
  getAllAuthors: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/authors`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch authors' }
    }
  },

  // Get single author
  getAuthor: async (authorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/authors/${authorId}`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch author' }
    }
  },

  // Update author profile
  updateAuthor: async (authorId, authorData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/authors/${authorId}`,
        authorData,
        {
          headers: getAuthHeader()
        }
      )
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw { error: "You cannot edit another user's profile" }
      }
      if (error.response?.status === 422) {
        throw error.response.data.errors
      }
      throw error.response?.data || { error: 'Failed to update author' }
    }
  },

  // Delete author
  deleteAuthor: async (authorId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/authors/${authorId}`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw { error: "You cannot delete another user's profile" }
      }
      throw error.response?.data || { error: 'Failed to delete author' }
    }
  },

  // Get author stats
  getAuthorStats: async (authorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/authors/${authorId}/stats`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch author stats' }
    }
  }
} 
