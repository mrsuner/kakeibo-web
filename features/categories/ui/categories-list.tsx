'use client'

import { CategoryCard } from './category-card'
import type { Category } from '../domain/categories.types'

interface CategoriesListProps {
  categories: Category[]
  isLoading: boolean
  error: any
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onSetDefault: (category: Category) => void
  onAddCategory: () => void
  getCategoryIcon: (category: Category) => string
  busy?: boolean
  pendingDefaultId?: number | null
}

export function CategoriesList({
  categories,
  isLoading,
  error,
  onEdit,
  onDelete,
  onSetDefault,
  onAddCategory,
  getCategoryIcon,
  busy,
  pendingDefaultId
}: CategoriesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 animate-pulse">
            <div className="h-5 bg-base-300 rounded w-48 mb-3"></div>
            <div className="h-3 bg-base-300 rounded w-72"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">Failed to load categories</h3>
        <p className="text-base-content/70 mb-6">Please refresh and try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
        <div className="text-6xl mb-4">🏷️</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">No categories found</h3>
        <p className="text-base-content/70 mb-6">Try adjusting your search or filters</p>
        <button className="btn btn-primary" onClick={onAddCategory}>Add Your First Category</button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          icon={getCategoryIcon(cat)}
          onEdit={() => onEdit(cat)}
          onDelete={() => onDelete(cat)}
          onSetDefault={() => onSetDefault(cat)}
          busy={busy || pendingDefaultId === cat.id}
        />
      ))}
    </div>
  )
}