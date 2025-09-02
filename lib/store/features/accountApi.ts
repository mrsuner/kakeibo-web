import { baseApi } from '../baseApi'

export interface Account {
  id: number
  name: string
  type: string
  balance: number
  isActive: boolean
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

export interface CreateAccountRequest {
  name: string
  type: string
  balance: number
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

export interface UpdateAccountRequest {
  name?: string
  type?: string
  balance?: number
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => 'accounts',
      transformResponse: (response: { data: Account[] }) => response.data,
      providesTags: ['Account'],
    }),
    getAccount: builder.query<Account, number>({
      query: (id) => `accounts/${id}`,
      transformResponse: (response: { data: Account }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (account) => ({
        url: 'accounts',
        method: 'POST',
        body: account,
      }),
      transformResponse: (response: { data: Account }) => response.data,
      invalidatesTags: ['Account'],
    }),
    updateAccount: builder.mutation<Account, { id: number } & UpdateAccountRequest>({
      query: ({ id, ...patch }) => ({
        url: `accounts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: { data: Account }) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'Account', id }],
    }),
    toggleAccount: builder.mutation<Account, number>({
      query: (id) => ({
        url: `accounts/${id}/toggle`,
        method: 'POST',
      }),
      transformResponse: (response: { data: Account }) => response.data,
      invalidatesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    deleteAccount: builder.mutation<void, number>({
      query: (id) => ({
        url: `accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAccountsQuery,
  useGetAccountQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useToggleAccountMutation,
  useDeleteAccountMutation,
} = accountApi