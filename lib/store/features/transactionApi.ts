import { baseApi } from '../baseApi'
import { z } from 'zod'

// Zod schemas for validation
const TransactionCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
})

const TransactionAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const TransactionTagSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
  category: TransactionCategorySchema.optional().nullable(),
  account: TransactionAccountSchema.optional().nullable(),
  tags: z.array(TransactionTagSchema),
  necessityRating: z.number().optional().nullable(),
})

const TransactionsResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    transactions: z.array(TransactionSchema),
  }),
})

const TransactionResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    transaction: TransactionSchema,
  }),
})

// Types
export type Transaction = z.infer<typeof TransactionSchema>
export type TransactionCategory = z.infer<typeof TransactionCategorySchema>
export type TransactionAccount = z.infer<typeof TransactionAccountSchema>
export type TransactionTag = z.infer<typeof TransactionTagSchema>
export type TransactionsResponse = z.infer<typeof TransactionsResponseSchema>
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>

export interface CreateTransactionDto {
  type: 'income' | 'expense'
  amount: number
  description: string
  category_id: number
  account_id: number
  date: string
  tags?: string
  necessityRating?: number
  file_ids?: number[]
}

export interface UpdateTransactionDto {
  type?: 'income' | 'expense'
  amount?: number
  description?: string
  category_id?: number
  account_id?: number
  date?: string
  tags?: string
  necessityRating?: number
  file_ids?: number[]
}

// API slice
export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], { 
      account_id?: number, 
      category_id?: number, 
      type?: 'income' | 'expense', 
      limit?: number 
    }>({
      query: (params) => ({
        url: '/transactions',
        params,
      }),
      transformResponse: (response: any) => {
        // Handle the case where response might be an array directly
        if (Array.isArray(response)) {
          return response
        }
        // Handle the wrapped response format
        if (response?.data?.transactions) {
          return response.data.transactions
        }
        // Fallback to empty array
        return []
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Transaction' as const, id })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    getTransaction: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      transformResponse: (response: any) => {
        if (response?.data?.transaction) {
          return response.data.transaction
        }
        return response
      },
      providesTags: (result, error, id) => [{ type: 'Transaction', id }],
    }),

    createTransaction: builder.mutation<Transaction, CreateTransactionDto>({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.transaction) {
          return response.data.transaction
        }
        return response
      },
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }, { type: 'Account', id: 'LIST' }],
    }),

    updateTransaction: builder.mutation<Transaction, { id: string; transaction: UpdateTransactionDto }>({
      query: ({ id, transaction }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: transaction,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.transaction) {
          return response.data.transaction
        }
        return response
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        { type: 'Transaction', id: 'LIST' },
        { type: 'Account', id: 'LIST' },
      ],
    }),

    deleteTransaction: builder.mutation<void, string>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Transaction', id: 'LIST' }, { type: 'Account', id: 'LIST' }],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi