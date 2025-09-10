import { baseApi } from '../baseApi'

export type AccountType = 
  | 'cash' 
  | 'savings_account' 
  | 'debit_card' 
  | 'credit_card' 
  | 'e_wallet'

export interface Account {
  id: number
  name: string
  type: AccountType
  balance: number
  isActive: boolean
  isDefault?: boolean
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

export interface CreateAccountRequest {
  name: string
  type: AccountType
  balance: number
  description?: string
  credit_limit?: number
  billing_cycle_day?: number
  payment_due_day?: number
  isDefault?: boolean
}

export interface UpdateAccountRequest {
  name?: string
  type?: AccountType
  balance?: number
  description?: string
  credit_limit?: number
  billing_cycle_day?: number
  payment_due_day?: number
  isDefault?: boolean
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
    setAsDefaultAccount: builder.mutation<Account, number>({
      query: (id) => ({
        url: `accounts/${id}/set-default`,
        method: 'POST',
      }),
      transformResponse: (response: { data: Account }) => response.data,
      invalidatesTags: [
        'Account',
        { type: 'Account', id: 'DEFAULT' },
      ],
    }),
    getDefaultAccount: builder.query<Account | null, void>({
      query: () => 'accounts/default/get',
      transformResponse: (response: { data: Account | null }) => response.data,
      providesTags: [{ type: 'Account', id: 'DEFAULT' }],
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
  useSetAsDefaultAccountMutation,
  useGetDefaultAccountQuery,
} = accountApi