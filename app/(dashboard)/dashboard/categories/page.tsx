'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '@/lib/store/hooks'
import { baseApi } from '@/lib/store/baseApi'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useSetAsDefaultCategoryMutation,
  type Category,
} from '@/lib/store/features/categoryApi'

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'hits'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch (server-side filter by type only)
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery({
    type: typeFilter === 'all' ? undefined : typeFilter,
  })

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
  const [setDefault, { isLoading: isSettingDefault }] = useSetAsDefaultCategoryMutation()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [pendingDefaultId, setPendingDefaultId] = useState<number | null>(null)

  // Helpers to mirror transactions UI style
  const getIcon = (cat: Category) => {
    if (cat.icon) return cat.icon
    const n = cat.name.toLowerCase()
    if (n.includes('food')) return '🍽️'
    if (n.includes('transport')) return '🚗'
    if (n.includes('shopping')) return '🛍️'
    if (n.includes('entertainment')) return '🎮'
    if (n.includes('salary') || n.includes('income')) return '💰'
    return cat.type === 'income' ? '💵' : '💸'
  }

  const filtered = useMemo(() => {
    let list = [...categories]
    // Status
    if (statusFilter !== 'all') {
      list = list.filter((c) => (statusFilter === 'active' ? c.isActive : !c.isActive))
    }
    // Search
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s))
    }
    // Sort
    list.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else {
        cmp = (a.hits || 0) - (b.hits || 0)
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return list
  }, [categories, debouncedSearch, statusFilter, sortBy, sortOrder])

  const total = categories.length
  const incomeCount = categories.filter((c) => c.type === 'income').length
  const expenseCount = categories.filter((c) => c.type === 'expense').length

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
            <button className="btn btn-outline btn-sm">Export</button>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setIsFormOpen(true) }}>+ Add Category</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-base-100 rounded-xl p-6 shadow-sm">
          <p className="text-base-content/70 text-sm">Total Categories</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-base-100 rounded-xl p-6 shadow-sm">
          <p className="text-base-content/70 text-sm">Income</p>
          <p className="text-2xl font-bold text-success">{incomeCount}</p>
        </div>
        <div className="bg-base-100 rounded-xl p-6 shadow-sm">
          <p className="text-base-content/70 text-sm">Expenses</p>
          <p className="text-2xl font-bold text-error">{expenseCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="input-group w-full">
              <input
                type="text"
                placeholder="Search categories..."
                className="input input-bordered flex-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="bg-base-200">
                <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Type */}
          <div>
            <select
              className="select select-bordered w-full"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              className="select select-bordered flex-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'hits')}
            >
              <option value="name">Sort by Name</option>
              <option value="hits">Sort by Usage</option>
            </select>
            <button
              className="btn btn-square btn-outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'desc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 animate-pulse">
              <div className="h-5 bg-base-300 rounded w-48 mb-3"></div>
              <div className="h-3 bg-base-300 rounded w-72"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">Failed to load categories</h3>
          <p className="text-base-content/70 mb-6">Please refresh and try again.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              icon={getIcon(cat)}
              onEdit={() => { setEditing(cat); setIsFormOpen(true) }}
              onDelete={async () => {
                if (confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
                  try { await deleteCategory(cat.id).unwrap() } catch (e) { console.error(e) }
                }
              }}
              onSetDefault={async () => {
                setPendingDefaultId(cat.id)
                // Optimistic update: mark this as default and others of same type as not default
                const patchResults: Array<ReturnType<typeof dispatch>> = []
                try {
                  patchResults.push(
                    dispatch(
                      baseApi.util.updateQueryData(
                        'getCategories',
                        { type: typeFilter === 'all' ? undefined : typeFilter },
                        (draft: Category[]) => {
                          draft.forEach((c) => {
                            if (c.type === cat.type) {
                              c.isDefault = c.id === cat.id
                            }
                          })
                        }
                      )
                    )
                  )
                  await setDefault(cat.id).unwrap()
                } catch (e) {
                  // Revert optimistic updates
                  patchResults.forEach((p: any) => p.undo && p.undo())
                  console.error(e)
                } finally {
                  setPendingDefaultId(null)
                }
              }}
              busy={isDeleting || isSettingDefault || pendingDefaultId === cat.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🏷️</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">No categories found</h3>
          <p className="text-base-content/70 mb-6">Try adjusting your search or filters</p>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setIsFormOpen(true) }}>Add Your First Category</button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <CategoryFormModal
          category={editing}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (payload) => {
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
          }}
          loading={isCreating || isUpdating}
        />
      )}
    </div>
  )
}

function CategoryCard({
  category,
  icon,
  onEdit,
  onDelete,
  onSetDefault,
  busy,
}: {
  category: Category
  icon: string
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
  busy?: boolean
}) {
  const color = category.color || '#999999'
  const budget = category.budget && Number(category.budget) > 0 ? Number(category.budget) : null

  return (
    <div className="bg-base-100 rounded-xl p-5 shadow-sm border border-base-200 hover:shadow-md transition">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div
            className="text-3xl p-2 rounded-lg flex-shrink-0"
            style={{ backgroundColor: `${color}15`, border: `2px solid ${color}30` }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-base-content truncate">{category.name}</h3>
              <span className={`badge badge-sm ${category.type === 'income' ? 'badge-success' : 'badge-error'} badge-outline`}>
                {category.type}
              </span>
              {category.isDefault && <span className="badge badge-sm badge-outline">Default</span>}
              <span className={`badge badge-sm ${category.isActive ? 'badge-ghost' : 'badge-outline'}`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-base-content/70 mt-1 break-words">{category.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-base-content/70">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
                Used {category.hits || 0}x
              </div>
              {budget && (
                <div className="text-sm text-base-content/70">Budget: ${budget.toFixed(2)}/{category.budgetPeriod || 'month'}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions: always use dropdown menu for consistency and space saving */}
        <div className="flex justify-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-2 w-44 p-2 shadow">
              {!category.isDefault && (
                <li>
                  <button onClick={onSetDefault} disabled={busy}>
                    {busy ? <span className="loading loading-spinner loading-xs" /> : 'Set Default'}
                  </button>
                </li>
              )}
              <li><button onClick={onEdit}>Edit</button></li>
              <li><button className="text-error" onClick={onDelete} disabled={busy}>Delete</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type CategoryFormPayload = {
  name: string
  type: 'income' | 'expense'
  color?: string
  icon?: string
  description?: string
  budget?: number
  budgetPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  isDefault?: boolean
}

function CategoryFormModal({
  category,
  onClose,
  onSubmit,
  loading,
}: {
  category: Category | null
  onClose: () => void
  onSubmit: (payload: CategoryFormPayload) => void | Promise<void>
  loading?: boolean
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [type, setType] = useState<'income' | 'expense'>(category?.type ?? 'expense')
  const [color, setColor] = useState<string>(category?.color ?? '#808080')
  const [icon, setIcon] = useState<string>(category?.icon ?? '')
  const [description, setDescription] = useState<string>(category?.description ?? '')
  const [budget, setBudget] = useState<string>(category?.budget ? String(category.budget) : '')
  const [budgetPeriod, setBudgetPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | ''>((category?.budgetPeriod as any) ?? '')
  const [isDefault, setIsDefault] = useState<boolean>(category?.isDefault ?? false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    const payload: CategoryFormPayload = {
      name: name.trim(),
      type,
      color,
      icon: icon || undefined,
      description: description || undefined,
      budget: budget ? Number(budget) : undefined,
      budgetPeriod: (budgetPeriod || undefined) as any,
      isDefault: isDefault || undefined,
    }
    setError(null)
    await onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-base-100 rounded-2xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button className="btn btn-ghost btn-circle" onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error py-2 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Groceries" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Type</span></label>
              <select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Color</span></label>
              <div className="flex gap-2">
                <input type="color" className="input input-bordered w-16 p-1" value={color} onChange={(e) => setColor(e.target.value)} />
                <input className="input input-bordered flex-1" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#808080" />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Icon</span></label>
              <input className="input input-bordered" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Emoji or short text (e.g., 🛒)" />
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea className="textarea textarea-bordered" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Budget</span></label>
              <input type="number" min="0" step="0.01" className="input input-bordered" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., 250" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Budget Period</span></label>
              <select className="select select-bordered" value={budgetPeriod} onChange={(e) => setBudgetPeriod(e.target.value as any)}>
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                <span className="label-text">Set as default for this type</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-base-200">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
              {loading ? 'Saving…' : category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
