'use client'

import type { Category } from '../domain/categories.types'

interface CategoryCardProps {
  category: Category
  icon: string
  onEdit: () => void
  onDelete: () => void
  onSetDefault: () => void
  busy?: boolean
}

export function CategoryCard({ 
  category, 
  icon, 
  onEdit, 
  onDelete, 
  onSetDefault, 
  busy 
}: CategoryCardProps) {
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
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
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
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {!category.isDefault && (
              <button
                onClick={onSetDefault}
                disabled={busy}
                className="btn btn-ghost btn-xs sm:btn-sm text-base-content/60 hover:text-success p-1 sm:p-2"
                title="Set as default"
              >
                {busy ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )}
            <button
              onClick={onEdit}
              className="btn btn-ghost btn-xs sm:btn-sm text-base-content/60 hover:text-primary p-1 sm:p-2"
              title="Edit category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              disabled={busy}
              className="btn btn-ghost btn-xs sm:btn-sm text-base-content/60 hover:text-error p-1 sm:p-2"
              title="Delete category"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}