import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from './index'

const fileUploadBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Try to get token from Redux state first
    const state = getState() as RootState
    const token = state.auth.token
    
    // If no token in Redux, try localStorage (client-side only)
    let authToken = token
    if (!authToken && typeof window !== 'undefined') {
      authToken = localStorage.getItem('access_token')
    }
    
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`)
    }
    
    headers.set('Accept', 'application/json')
    // Don't set Content-Type for file uploads - let browser set it
    
    return headers
  },
})

const fileBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await fileUploadBaseQuery(args, api, extraOptions)
  
  if (result.error && result.error.status === 401) {
    // Token is invalid, clear localStorage and Redux state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
    
    // Dispatch logout action
    const { logout } = await import('./authSlice')
    api.dispatch(logout())
  }
  
  return result
}

export const fileBaseApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: fileBaseQueryWithReauth,
  tagTypes: ['File'],
  endpoints: () => ({}),
})

export default fileBaseApi