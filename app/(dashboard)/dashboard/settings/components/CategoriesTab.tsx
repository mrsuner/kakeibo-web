'use client'

import { useState } from 'react'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'

interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  isActive: boolean
  icon?: string
  budget?: number
  budgetPeriod?: string
}

interface CategoriesTabProps {
  categories: Category[]
  onCategoryToggle: (categoryId: number) => void
  onCategoryUpdate: (category: Category) => void
  onCategoryAdd: (category: Omit<Category, 'id'>) => void
}

export default function CategoriesTab({
  categories,
  onCategoryToggle,
  onCategoryUpdate,
  onCategoryAdd
}: CategoriesTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleCategoryUpdate = (updatedCategory: Category) => {
    onCategoryUpdate(updatedCategory)
    setEditingCategory(null)
  }

  const handleCategoryAdd = (newCategory: Omit<Category, 'id'>) => {
    onCategoryAdd(newCategory)
    setShowAddModal(false)
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Category Management</h2>
          <p className="text-base-content/70 mt-1">Organize your income and expense categories</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div>
          <h3 className="text-lg font-semibold text-error mb-4 flex items-center gap-2">
            <span>💸</span>
            Expense Categories ({expenseCategories.length})
          </h3>
          <div className="space-y-3">
            {expenseCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.name}</span>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit category"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    {category.budget && (
                      <div className="text-xs text-base-content/60">
                        Budget: ${category.budget.toLocaleString()}/{category.budgetPeriod || 'month'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
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
                    onChange={() => onCategoryToggle(category.id)}
                  />
                </div>
              </div>
            ))}
            {expenseCategories.length === 0 && (
              <div className="text-center py-8 text-base-content/50">
                <div className="text-4xl mb-2">📝</div>
                <p>No expense categories yet</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-sm btn-outline btn-primary mt-2"
                >
                  Add your first expense category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h3 className="text-lg font-semibold text-success mb-4 flex items-center gap-2">
            <span>💰</span>
            Income Categories ({incomeCategories.length})
          </h3>
          <div className="space-y-3">
            {incomeCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {category.budget && (
                      <div className="text-xs text-base-content/60">
                        Target: ${category.budget.toLocaleString()}/{category.budgetPeriod || 'month'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
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
                    onChange={() => onCategoryToggle(category.id)}
                  />
                </div>
              </div>
            ))}
            {incomeCategories.length === 0 && (
              <div className="text-center py-8 text-base-content/50">
                <div className="text-4xl mb-2">💼</div>
                <p>No income categories yet</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-sm btn-outline btn-primary mt-2"
                >
                  Add your first income category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Summary */}
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

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onSave={handleCategoryAdd}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleCategoryUpdate}
        />
      )}
    </div>
  )
}