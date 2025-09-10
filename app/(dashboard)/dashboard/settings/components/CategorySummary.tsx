'use client'

import { type Category } from '@/features/categories'

interface CategorySummaryProps {
  categories: Category[]
  expenseCategories: Category[]
  incomeCategories: Category[]
}

export default function CategorySummary({ categories, expenseCategories, incomeCategories }: CategorySummaryProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-base-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-primary">{categories.length}</div>
        <div className="text-sm text-base-content/70">Total Categories</div>
      </div>
      <div className="bg-base-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-success">{incomeCategories.filter(c => c.isActive).length}</div>
        <div className="text-sm text-base-content/70">Active Income Categories</div>
      </div>
      <div className="bg-base-100 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-error">{expenseCategories.filter(c => c.isActive).length}</div>
        <div className="text-sm text-base-content/70">Active Expense Categories</div>
      </div>
    </div>
  )
}