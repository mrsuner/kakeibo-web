import { baseApi } from './baseApi'

export interface User {
  id: number
  name?: string
  email: string
  email_verified_at?: string
  phone_dial_code?: string
  phone_number?: string
  phone_verified_at?: string
  gender?: string
  avatar?: string
  base_currency_id: string
  base_currency: string
  subscription_plan: string
  timezone: string
  language: string
  month_start?: number
  week_start?: number
  created_at: string
  updated_at: string
}

export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
  country: string
  flag: string
}

export interface UpdateUserRequest {
  name?: string
  timezone?: string
  language?: string
  month_start?: number
  week_start?: number
  avatar?: string
}

export interface UserStats {
  total_transactions: number
  active_accounts: number
  days_active: number
}

export interface DashboardAccountBalance {
  name: string
  balance: number
  type: 'cash' | 'bank'
}

export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
}

export interface DashboardCategorySpending {
  category: string
  amount: number
  percentage: number
}

export interface DashboardData {
  totalAssets: number
  monthlyIncome: number
  monthlyExpenses: number
  accountBalances: DashboardAccountBalance[]
  recentTransactions: DashboardTransaction[]
  categorySpending: DashboardCategorySpending[]
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
    updateMe: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: '/me',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data,
      invalidatesTags: ['User'],
    }),
    getCurrencies: builder.query<Currency[], void>({
      query: () => '/currencies',
      transformResponse: (response: ApiResponse<Currency[]>) => response.data,
      providesTags: ['Currency'],
    }),
    getMeStats: builder.query<UserStats, void>({
      query: () => '/me/stats',
      transformResponse: (response: ApiResponse<UserStats>) => response.data,
      providesTags: ['User'],
    }),
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/me/dashboard',
      transformResponse: (response: ApiResponse<DashboardData>) => response.data,
      providesTags: ['User', 'Account', 'Transaction'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useObtainOtpMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetCurrenciesQuery,
  useGetMeStatsQuery,
  useGetDashboardQuery,
} = authApi
