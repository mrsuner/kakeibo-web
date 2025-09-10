'use client'

import { useEffect, useState } from 'react'
import { baseApi } from '@/lib/store/baseApi'
import { useAppDispatch } from '@/lib/store/hooks'
import {
  CategoriesFilters,
  CategoriesList,
  CategoriesSummary,
  CategoryFormModal,
  type Category,
  type CategoryFilters,
  type CategoryFormPayload,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFilteredCategories,
  useGetCategoriesQuery,
  useSetAsDefaultCategoryMutation,
  useUpdateCategoryMutation,
  useCategoryStats,
} from '@/features/categories'

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    typeFilter: 'all',
    statusFilter: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }))
  }, [debouncedSearch])

  // Fetch categories
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery({
    type: filters.typeFilter === 'all' ? undefined : filters.typeFilter,
  })

  // Mutations
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
  const [setDefault, { isLoading: isSettingDefault }] = useSetAsDefaultCategoryMutation()

  // State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [pendingDefaultId, setPendingDefaultId] = useState<number | null>(null)

  // Hooks
  const filteredCategories = useFilteredCategories(categories, filters)
  const stats = useCategoryStats(categories)

  const handleFiltersChange = (newFilters: Partial<CategoryFilters>) => {
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search)
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }))
    }
  }

  const handleEdit = (category: Category) => {
    setEditing(category)
    setIsFormOpen(true)
  }

  const handleDelete = async (category: Category) => {
    if (confirm(`Delete category "${category.name}"? This cannot be undone.`)) {
      try {
        await deleteCategory(category.id).unwrap()
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleSetDefault = async (category: Category) => {
    setPendingDefaultId(category.id)
    // Optimistic update
    const patchResults: Array<ReturnType<typeof dispatch>> = []
    try {
      patchResults.push(
        dispatch(
          baseApi.util.updateQueryData(
            'getCategories',
            { type: filters.typeFilter === 'all' ? undefined : filters.typeFilter },
            (draft: Category[]) => {
              draft.forEach((c) => {
                if (c.type === category.type) {
                  c.isDefault = c.id === category.id
                }
              })
            }
          )
        )
      )
      await setDefault(category.id).unwrap()
    } catch (e) {
      // Revert optimistic updates
      for (const p of patchResults) {
        if (p.undo) {
          p.undo()
        }
      }
      console.error(e)
    } finally {
      setPendingDefaultId(null)
    }
  }

  const handleAddCategory = () => {
    setEditing(null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (payload: CategoryFormPayload) => {
    try {
      if (editing) {
        await updateCategory({ id: editing.id, category: payload }).unwrap()
      } else {
        await createCategory(payload).unwrap()
      }
      setIsFormOpen(false)
    } catch (e) {
      console.error('Failed to save category', e)
    }
  }

  const getCategoryIcon = (category: Category) => {
    if (category.icon) return category.icon
    const n = category.name.toLowerCase()
    if (n.includes('food')) return '🍽️'
    if (n.includes('transport')) return '🚗'
    if (n.includes('shopping')) return '🛍️'
    if (n.includes('entertainment')) return '🎮'
    if (n.includes('salary') || n.includes('income')) return '💰'
    return category.type === 'income' ? '💵' : '💸'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">Categories</h1>
            <p className="text-base-content/70 mt-1">Create and manage your income and expense categories</p>
          </div>
          <div className="flex items-center space-x-3">
            <button type="button" className="btn btn-outline btn-sm">Export</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddCategory}>+ Add Category</button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <CategoriesSummary 
        total={stats.total}
        incomeCount={stats.incomeCount}
        expenseCount={stats.expenseCount}
      />

      {/* Filters */}
      <CategoriesFilters
        filters={{ ...filters, search }}
        onFiltersChange={handleFiltersChange}
      />

      {/* Categories List */}
      <CategoriesList
        categories={filteredCategories}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
        onAddCategory={handleAddCategory}
        getCategoryIcon={getCategoryIcon}
        busy={isDeleting || isSettingDefault}
        pendingDefaultId={pendingDefaultId}
      />

      {/* Form Modal */}
      {isFormOpen && (
        <CategoryFormModal
          category={editing}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          loading={isCreating || isUpdating}
        />
      )}
    </div>
  )
}