import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postsApi } from '../../api/postsApi'

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await postsApi.getAllPosts(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch posts')
    }
  }
)

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsApi.createPost(postData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await postsApi.updatePost(postId, postData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update post')
    }
  }
)

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postsApi.deletePost(postId)
      return postId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete post')
    }
  }
)

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postsApi.likePost(postId)
      return { postId, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to like post')
    }
  }
)

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postsApi.unlikePost(postId)
      return { postId, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to unlike post')
    }
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    currentPost: null,
    isLoading: false,
    error: null,
    filters: {
      author: null,
      sort: 'created_at',
      order: 'desc'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        author: null,
        sort: 'created_at',
        order: 'desc'
      }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((post) => post.id !== action.payload)
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null
        }
      })
      // Like/Unlike post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.items.find((p) => p.id === action.payload.postId)
        if (post) {
          post.likes_count = action.payload.likes_count
          post.is_liked = true
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.likes_count = action.payload.likes_count
          state.currentPost.is_liked = true
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.items.find((p) => p.id === action.payload.postId)
        if (post) {
          post.likes_count = action.payload.likes_count
          post.is_liked = false
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.likes_count = action.payload.likes_count
          state.currentPost.is_liked = false
        }
      })
  }
})

export const { setFilters, clearFilters, clearError } = postsSlice.actions
export default postsSlice.reducer