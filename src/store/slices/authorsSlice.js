import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authorsApi } from '../../api/authorsApi'

export const fetchAuthors = createAsyncThunk(
  'authors/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      return await authorsApi.getAllAuthors()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchAuthor = createAsyncThunk(
  'authors/fetchAuthor',
  async (authorId, { rejectWithValue }) => {
    try {
      return await authorsApi.getAuthor(authorId)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateAuthor = createAsyncThunk(
  'authors/updateAuthor',
  async ({ authorId, authorData }, { rejectWithValue }) => {
    try {
      return await authorsApi.updateAuthor(authorId, authorData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteAuthor = createAsyncThunk(
  'authors/deleteAuthor',
  async (authorId, { rejectWithValue }) => {
    try {
      await authorsApi.deleteAuthor(authorId)
      return authorId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authorsSlice = createSlice({
  name: 'authors',
  initialState: {
    items: [],
    currentAuthor: null,
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch authors
      .addCase(fetchAuthors.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch single author
      .addCase(fetchAuthor.fulfilled, (state, action) => {
        state.currentAuthor = action.payload
      })
      // Update author
      .addCase(updateAuthor.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (author) => author.id === action.payload.id
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentAuthor?.id === action.payload.id) {
          state.currentAuthor = action.payload
        }
      })
      // Delete author
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.items = state.items.filter((author) => author.id !== action.payload)
        if (state.currentAuthor?.id === action.payload) {
          state.currentAuthor = null
        }
      })
  }
})

export default authorsSlice.reducer 