import { baseApi } from './baseApi'

export interface User {
  id: number
  name?: string
  email: string
  email_verified_at?: string
  avatar?: string
  base_currency_id?: number
  base_currency?: string
  subscription_plan: string
  timezone: string
  language: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface ApiResponse<T> {
  meta: {
    code: number
    message: string
  }
  data: T
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    obtainOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/otp/obtain',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { meta: { message: string } }) => ({ message: response.meta.message }),
    }),
    verifyOtp: builder.mutation<AuthResponse, { email: string; otp: string }>({
      query: (data) => ({
        url: '/auth/otp/verify',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<AuthResponse>) => response.data,
      invalidatesTags: ['Auth', 'User'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/me',
      transformResponse: (response: ApiResponse<User>) => response.data,
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useObtainOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
} = authApi