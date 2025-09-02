import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.isLoading = false
      // Save to localStorage immediately when setting credentials
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      // Clear localStorage immediately when logging out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    initializeAuth: (state) => {
      // Only access localStorage on client side
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token')
        if (token) {
          state.token = token
          state.isAuthenticated = true
        }
      }
      state.isLoading = false
    },
  },
})

export const { setCredentials, logout, setLoading, initializeAuth } = authSlice.actions
export default authSlice.reducer