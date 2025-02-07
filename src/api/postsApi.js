import axios from 'axios'
import { getAuthHeader } from './authUtils'

const BASE_URL = 'https://stories.techzilla.site/api'

export const postsApi = {
  // Get all posts with optional filters
  getAllPosts: async (filters = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts`, {
        params: filters,
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch posts' }
    }
  },

  // Get posts by author
  getPostsByAuthor: async (authorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/author/${authorId}`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch author posts' }
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await axios.post(`${BASE_URL}/posts`, postData, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 422) {
        throw error.response.data.errors
      }
      throw error.response?.data || { error: 'Failed to create post' }
    }
  },

  // Get single post
  getPost: async (postId) => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch post' }
    }
  },

  // Update post
  updatePost: async (postId, postData) => {
    try {
      const response = await axios.put(`${BASE_URL}/posts/${postId}`, postData, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw { error: "You cannot edit another user's post" }
      }
      throw error.response?.data || { error: 'Failed to update post' }
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/posts/${postId}`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 403) {
        throw { error: "You cannot delete another user's post" }
      }
      throw error.response?.data || { error: 'Failed to delete post' }
    }
  },

  // Like/Unlike post
  likePost: async (postId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/like`,
        {},
        {
          headers: getAuthHeader()
        }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to like post' }
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/posts/${postId}/like`, {
        headers: getAuthHeader()
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to unlike post' }
    }
  }
} 
