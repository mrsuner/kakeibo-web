import { baseApi } from '../baseApi'

export type AccountType = string

export interface AccountBalance {
  id?: string
  currencyId: string
  currencyCode: string
  balance: number
}

export interface Account {
  id: string
  name: string
  type: AccountType
  balances: AccountBalance[]
  baseCurrencyId?: string
  baseCurrencyCode?: string
  // Derived convenience for UI (base currency balance)
  balance?: number
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
  // Deprecated: single balance. Prefer `balances` below.
  balance?: number
  // New: multi-currency balances
  balances?: Array<{
    currency_id: string
    balance: number
    average_cost?: number
  }>
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
      transformResponse: (response: { data: any[] }) =>
        response.data.map((a) => {
          const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
            id: b.id,
            currencyId: b.currencyId ?? b.currency_id,
            currencyCode: b.currencyCode ?? b.currency_code,
            balance: Number(b.balance ?? 0),
          }))
          const baseId = a.baseCurrencyId ?? a.base_currency_id
          const baseCode = a.baseCurrencyCode ?? a.base_currency_code
          const base = balances.find((b) => b.currencyId === baseId)
          return {
            id: String(a.id),
            name: a.name,
            type: a.type ?? a.account_type,
            balances,
            baseCurrencyId: baseId,
            baseCurrencyCode: baseCode,
            balance: base?.balance ?? 0,
            isActive: a.isActive ?? a.is_active ?? true,
            isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
            description: a.description ?? undefined,
            creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
            billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
            paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
          } as Account
        }),
      providesTags: ['Account'],
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => `accounts/${id}`,
      transformResponse: (response: { data: any }) => {
        const a = response.data
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
      providesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (account) => ({
        url: 'accounts',
        method: 'POST',
        body: account,
      }),
      transformResponse: (response: { data: any }) => {
        const a = response.data
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
      invalidatesTags: ['Account'],
    }),
    updateAccount: builder.mutation<Account, { id: string } & UpdateAccountRequest>({
      query: ({ id, ...patch }) => ({
        url: `accounts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: { data: any }) => {
        const a = response.data
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Account', id }],
    }),
    toggleAccount: builder.mutation<Account, string>({
      query: (id) => ({
        url: `accounts/${id}/toggle`,
        method: 'POST',
      }),
      transformResponse: (response: { data: any }) => {
        const a = response.data
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
      invalidatesTags: (result, error, id) => [{ type: 'Account', id }],
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `accounts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Account'],
    }),
    setAsDefaultAccount: builder.mutation<Account, string>({
      query: (id) => ({
        url: `accounts/${id}/set-default`,
        method: 'POST',
      }),
      transformResponse: (response: { data: any }) => {
        const a = response.data
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
      invalidatesTags: [
        'Account',
        { type: 'Account', id: 'DEFAULT' },
      ],
    }),
    getDefaultAccount: builder.query<Account | null, void>({
      query: () => 'accounts/default/get',
      transformResponse: (response: { data: any | null }) => {
        const a = response.data
        if (!a) return null
        const balances: AccountBalance[] = (a.balances || []).map((b: any) => ({
          id: b.id,
          currencyId: b.currencyId ?? b.currency_id,
          currencyCode: b.currencyCode ?? b.currency_code,
          balance: Number(b.balance ?? 0),
        }))
        const baseId = a.baseCurrencyId ?? a.base_currency_id
        const baseCode = a.baseCurrencyCode ?? a.base_currency_code
        const base = balances.find((b) => b.currencyId === baseId)
        return {
          id: String(a.id),
          name: a.name,
          type: a.type ?? a.account_type,
          balances,
          baseCurrencyId: baseId,
          baseCurrencyCode: baseCode,
          balance: base?.balance ?? 0,
          isActive: a.isActive ?? a.is_active ?? true,
          isDefault: a.isDefault ?? a.is_default ?? a.is_default_account ?? false,
          description: a.description ?? undefined,
          creditLimit: a.creditLimit ?? a.credit_limit ?? undefined,
          billingCycleDay: a.billingCycleDay ?? a.billing_cycle_day ?? undefined,
          paymentDueDay: a.paymentDueDay ?? a.payment_due_day ?? undefined,
        } as Account
      },
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
