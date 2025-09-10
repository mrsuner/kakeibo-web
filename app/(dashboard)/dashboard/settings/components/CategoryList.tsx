'use client'

import { type Category } from '@/features/categories'
import CategoryCard from './CategoryCard'
import EmptyState from './EmptyState'

interface CategoryListProps {
  type: 'expense' | 'income'
  categories: Category[]
  userCurrency: string
  onEditCategory: (category: Category) => void
  onToggleCategory: (categoryId: number) => void
  onAddCategory: () => void
}

export default function CategoryList({ 
  type, 
  categories, 
  userCurrency, 
  onEditCategory, 
  onToggleCategory, 
  onAddCategory 
}: CategoryListProps) {
  const config = {
    expense: {
      title: 'Expense Categories',
      emoji: '💸',
      textColor: 'text-error'
    },
    income: {
      title: 'Income Categories',
      emoji: '💰',
      textColor: 'text-success'
    }
  }

  const { title, emoji, textColor } = config[type]

  return (
    <div>
      <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
        <span>{emoji}</span>
        {title} ({categories.length})
      </h3>
      <div className="space-y-3">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            userCurrency={userCurrency}
            onEdit={onEditCategory}
            onToggle={onToggleCategory}
          />
        ))}
        {categories.length === 0 && (
          <EmptyState type={type} onAddCategory={onAddCategory} />
        )}
      </div>
    </div>
  )
}