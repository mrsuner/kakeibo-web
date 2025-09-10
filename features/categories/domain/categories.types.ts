import { z } from 'zod'

// Zod schemas for validation
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['income', 'expense']),
  color: z.string(),
  isActive: z.boolean(),
  icon: z.string().optional().nullable(),
  budget: z.union([z.number(), z.string()]).optional().nullable().transform((val) => {
    if (val === null || val === undefined) return null
    return typeof val === 'string' ? parseFloat(val) : val
  }),
  budgetPeriod: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  hits: z.number().optional().default(0),
  isDefault: z.boolean().optional().default(false),
})

export const CategoriesResponseSchema = z.object({
  meta: z.object({
    code: z.number(),
    message: z.string(),
  }),
  data: z.object({
    categories: z.array(CategorySchema),
  }),
})

export const CategoryResponseSchema = z.object({
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
  isDefault?: boolean
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
  isDefault?: boolean
}

export interface CategoryFormPayload {
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  description?: string
  budget?: number
  budgetPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  isDefault?: boolean
}

export interface CategoryFilters {
  search: string
  typeFilter: 'all' | 'income' | 'expense'
  statusFilter: 'all' | 'active' | 'inactive'
  sortBy: 'name' | 'hits'
  sortOrder: 'asc' | 'desc'
}