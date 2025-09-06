import { baseApi } from '../baseApi'
import { z } from 'zod'

// Zod schemas for validation
const TransactionCategorySchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  icon: z.string().optional().nullable(),
  type: z.string().optional(),
})

const TransactionAccountSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  type: z.string().optional(),
})

const TransactionTagSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  color: z.string().optional().nullable(),
})

const TransactionFileSchema = z.object({
  id: z.union([z.number(), z.string()]),
  file_id: z.string(),
  filename: z.string().optional().nullable(),
})

const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  converted_amount: z.number().optional().nullable(),
  currency_code: z.string(),
  flow_type: z.enum(['income', 'expense']),
  transaction_at: z.string(),
  necessity_rating: z.number().optional().nullable(),
  balance_after: z.number().optional().nullable(),
  category: TransactionCategorySchema.optional().nullable(),
  account: TransactionAccountSchema.optional().nullable(),
  tags: z.array(TransactionTagSchema),
  files: z.array(TransactionFileSchema).optional(),
})

const TransactionSummarySchema = z.object({
  total_income: z.number(),
  total_expenses: z.number(),
  net_amount: z.number(),
})

const PaginationSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
})

const TransactionsResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
    pagination: PaginationSchema.optional(),
  }),
  data: z.object({
    transactions: z.array(TransactionSchema),
    summary: TransactionSummarySchema.optional(),
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
export type TransactionFile = z.infer<typeof TransactionFileSchema>
export type TransactionSummary = z.infer<typeof TransactionSummarySchema>
export type Pagination = z.infer<typeof PaginationSchema>
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
  file_ids?: string[]
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
  file_ids?: string[]
}

export interface GetTransactionsParams {
  account_id?: number
  category_id?: number
  type?: 'income' | 'expense'
  search?: string
  sort_by?: 'transaction_at' | 'amount'
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface GetTransactionsResult {
  transactions: Transaction[]
  summary?: TransactionSummary
  pagination?: Pagination
}

// API slice
export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<GetTransactionsResult, GetTransactionsParams>({
      query: (params) => ({
        url: '/transactions',
        params: {
          ...params,
          // Ensure defaults
          sort_by: params.sort_by || 'transaction_at',
          sort_order: params.sort_order || 'desc',
          limit: params.limit || 15,
          page: params.page || 1,
        },
      }),
      transformResponse: (response: any) => {
        // Handle the wrapped response format
        if (response?.data) {
          return {
            transactions: response.data.transactions || [],
            summary: response.data.summary,
            pagination: response.meta.pagination,
          }
        }
        // Fallback
        return {
          transactions: [],
        }
      },
      providesTags: (result) =>
        result?.transactions
          ? [
              ...result.transactions.map(({ id }) => ({ type: 'Transaction' as const, id })),
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