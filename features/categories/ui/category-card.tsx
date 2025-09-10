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