import { baseApi } from '../baseApi'
import { z } from 'zod'

// Zod schemas for validation
const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['income', 'expense']),
  color: z.string(),
  isActive: z.boolean(),
  icon: z.string().optional().nullable(),
  budget: z.number().optional().nullable(),
  budgetPeriod: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

const CategoriesResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    categories: z.array(CategorySchema),
  }),
})

const CategoryResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    category: CategorySchema,
  }),
})

// Types
export type Category = z.infer<typeof CategorySchema>
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>

export interface CreateCategoryDto {
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  description?: string
  budget?: number
  budgetPeriod?: string
  isActive?: boolean
}

export interface UpdateCategoryDto {
  name?: string
  type?: 'income' | 'expense'
  color?: string
  icon?: string
  description?: string
  budget?: number
  budgetPeriod?: string
  isActive?: boolean
}

// API slice
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], { type?: 'income' | 'expense' }>({
      query: (params) => ({
        url: '/categories',
        params,
      }),
      transformResponse: (response: any) => {
        // Handle the case where response might be an array directly
        if (Array.isArray(response)) {
          return response
        }
        // Handle the wrapped response format
        if (response?.data?.categories) {
          return response.data.categories
        }
        // Fallback to empty array
        return []
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCategory: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: any) => {
        if (response?.data?.category) {
          return response.data.category
        }
        return response
      },
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.category) {
          return response.data.category
        }
        return response
      },
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, { id: number; category: UpdateCategoryDto }>({
      query: ({ id, category }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: category,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.category) {
          return response.data.category
        }
        return response
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    toggleCategory: builder.mutation<Category, number>({
      query: (id) => ({
        url: `/categories/${id}/toggle`,
        method: 'POST',
      }),
      transformResponse: (response: any) => {
        if (response?.data?.category) {
          return response.data.category
        }
        return response
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi