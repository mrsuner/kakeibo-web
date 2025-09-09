import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { RootState } from './index'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  prepareHeaders: (headers, { getState }) => {
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
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  
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

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth', 'Account', 'Category', 'Transaction', 'Currency', 'Tag', 'Report'],
  endpoints: () => ({}),
})

export default baseApi