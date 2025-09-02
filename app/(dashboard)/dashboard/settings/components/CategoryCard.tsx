'use client'

import { type Category } from '@/lib/store/features/categoryApi'

interface CategoryCardProps {
  category: Category
  userCurrency: string
  onEdit: (category: Category) => void
  onToggle: (categoryId: number) => void
}

export default function CategoryCard({ category, userCurrency, onEdit, onToggle }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <div 
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        ></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{category.name}</span>
            {category.icon && <span>{category.icon}</span>}
          </div>
          {category.budget && (
            <div className="text-xs text-base-content/60">
              {category.type === 'expense' ? 'Budget' : 'Target'}: {userCurrency} {category.budget.toLocaleString()}/{category.budgetPeriod || 'month'}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(category)}
          className="btn btn-ghost btn-xs"
          title="Edit category"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <input 
          type="checkbox" 
          className="toggle toggle-primary toggle-sm" 
          checked={category.isActive}
          onChange={() => onToggle(category.id)}
        />
      </div>
    </div>
  )
}