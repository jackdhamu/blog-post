import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import postsReducer from './slices/postsSlice'
import authorsReducer from './slices/authorsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    authors: authorsReducer
  }
}) 