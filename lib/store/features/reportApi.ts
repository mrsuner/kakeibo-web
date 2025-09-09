import { baseApi } from '../baseApi'
import { z } from 'zod'

// Zod schemas for validation
const PeriodSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  days: z.number().optional(),
})

const FinancialDataSchema = z.object({
  amount: z.number(),
  count: z.number().optional(),
  change_percentage: z.number().optional(),
})

const TotalSpendingReportSchema = z.object({
  period: PeriodSchema,
  current: z.object({
    income: FinancialDataSchema,
    expense: FinancialDataSchema,
    outstanding: FinancialDataSchema,
    net: z.object({
      amount: z.number(),
    }),
  }),
  previous: z.object({
    income: z.number(),
    expense: z.number(),
    net: z.number(),
  }),
})

const CategorySpendingItemSchema = z.object({
  category_id: z.union([z.string(), z.number()]),
  category_name: z.string(),
  category_color: z.string(),
  category_icon: z.string().optional(),
  current_amount: z.number(),
  previous_amount: z.number(),
  transaction_count: z.number(),
  avg_amount: z.number(),
  percentage_of_total: z.number(),
  change_percentage: z.number(),
  trend: z.enum(['up', 'down', 'stable']),
})

const CategoriesSpendingReportSchema = z.object({
  period: PeriodSchema,
  summary: z.object({
    total_spending: z.number(),
    categories_count: z.number(),
    total_transactions: z.number(),
  }),
  categories: z.array(CategorySpendingItemSchema),
})

const SpendingTrendItemSchema = z.object({
  period: z.string(),
  income: z.number(),
  expense: z.number(),
  net: z.number(),
})

const DashboardReportSchema = z.object({
  time_range: z.string(),
  period: PeriodSchema,
  total_spending: TotalSpendingReportSchema,
  categories_spending: CategoriesSpendingReportSchema,
  trends: z.array(SpendingTrendItemSchema),
})

// API Response wrapper schema
const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    meta: z.object({
      code: z.number(),
      message: z.string(),
    }),
    data: dataSchema,
  })

// TypeScript types
export type TotalSpendingReport = z.infer<typeof TotalSpendingReportSchema>
export type CategoriesSpendingReport = z.infer<typeof CategoriesSpendingReportSchema>
export type CategorySpendingItem = z.infer<typeof CategorySpendingItemSchema>
export type SpendingTrendItem = z.infer<typeof SpendingTrendItemSchema>
export type DashboardReport = z.infer<typeof DashboardReportSchema>

export interface ReportFilters {
  time_range: 'this_week' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom'
  start_date?: string
  end_date?: string
  group_by?: 'day' | 'week' | 'month'
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTotalSpendingReport: builder.query<TotalSpendingReport, ReportFilters>({
      query: (filters) => ({
        url: 'reports/total-spending',
        method: 'GET',
        params: filters,
      }),
      transformResponse: (response: { data: TotalSpendingReport }) => response.data,
      providesTags: ['Report', 'Transaction'],
    }),

    getCategoriesSpendingReport: builder.query<CategoriesSpendingReport, ReportFilters>({
      query: (filters) => ({
        url: 'reports/categories-spending',
        method: 'GET',
        params: filters,
      }),
      transformResponse: (response: { data: CategoriesSpendingReport }) => response.data,
      providesTags: ['Report', 'Transaction', 'Category'],
    }),

    getSpendingTrends: builder.query<{ period: any; group_by: string; trends: SpendingTrendItem[] }, ReportFilters>({
      query: (filters) => ({
        url: 'reports/spending-trends',
        method: 'GET',
        params: filters,
      }),
      transformResponse: (response: { data: { period: any; group_by: string; trends: SpendingTrendItem[] } }) => response.data,
      providesTags: ['Report', 'Transaction'],
    }),

    getDashboardReport: builder.query<DashboardReport, ReportFilters>({
      query: (filters) => ({
        url: 'reports/dashboard',
        method: 'GET',
        params: filters,
      }),
      transformResponse: (response: { data: DashboardReport }) => response.data,
      providesTags: ['Report', 'Transaction', 'Category'],
    }),
  }),
})

export const {
  useGetTotalSpendingReportQuery,
  useGetCategoriesSpendingReportQuery,
  useGetSpendingTrendsQuery,
  useGetDashboardReportQuery,
  useLazyGetTotalSpendingReportQuery,
  useLazyGetCategoriesSpendingReportQuery,
  useLazyGetSpendingTrendsQuery,
  useLazyGetDashboardReportQuery,
} = reportApi