'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'
import { 
  useGetCategoriesQuery, 
  useToggleCategoryMutation,
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
  type Category,
  type CreateCategoryDto,
  type UpdateCategoryDto
} from '@/lib/store/features/categoryApi'

interface CategoryForModal extends Category {
  budgetPeriod?: string | null
}

export default function CategoriesTabWithAPI() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryForModal | null>(null)
  
  // Get user's currency from Redux store
  const user = useSelector((state: RootState) => state.auth.user)
  const userCurrency = user?.base_currency || 'USD'
  
  // API hooks
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery({})
  const [toggleCategory] = useToggleCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [createCategory] = useCreateCategoryMutation()

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category as CategoryForModal)
  }

  const handleCategoryToggle = async (categoryId: number) => {
    try {
      await toggleCategory(categoryId).unwrap()
    } catch (error) {
      console.error('Failed to toggle category:', error)
    }
  }

  const handleCategoryUpdate = async (updatedCategory: CategoryForModal) => {
    try {
      const updateDto: UpdateCategoryDto = {
        name: updatedCategory.name,
        type: updatedCategory.type,
        color: updatedCategory.color,
        icon: updatedCategory.icon || undefined,
        description: updatedCategory.description || undefined,
        budget: updatedCategory.budget || undefined,
        budgetPeriod: updatedCategory.budgetPeriod || undefined,
        isActive: updatedCategory.isActive,
      }
      
      await updateCategory({ 
        id: updatedCategory.id, 
        category: updateDto 
      }).unwrap()
      
      setEditingCategory(null)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleCategoryAdd = async (newCategory: Omit<CategoryForModal, 'id'>) => {
    try {
      const createDto: CreateCategoryDto = {
        name: newCategory.name,
        type: newCategory.type,
        color: newCategory.color || '#808080',
        icon: newCategory.icon || undefined,
        description: newCategory.description || undefined,
        budget: newCategory.budget || undefined,
        budgetPeriod: newCategory.budgetPeriod || undefined,
        isActive: newCategory.isActive ?? true,
      }
      
      await createCategory(createDto).unwrap()
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error loading categories. Please try again later.</span>
      </div>
    )
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
                      {category.icon && <span>{category.icon}</span>}
                    </div>
                    {category.budget && (
                      <div className="text-xs text-base-content/60">
                        Budget: {userCurrency} {category.budget.toLocaleString()}/{category.budgetPeriod || 'month'}
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
                    onChange={() => handleCategoryToggle(category.id)}
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
                      {category.icon && <span>{category.icon}</span>}
                    </div>
                    {category.budget && (
                      <div className="text-xs text-base-content/60">
                        Target: {userCurrency} {category.budget.toLocaleString()}/{category.budgetPeriod || 'month'}
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
                    onChange={() => handleCategoryToggle(category.id)}
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
          userCurrency={userCurrency}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleCategoryUpdate}
          userCurrency={userCurrency}
        />
      )}
    </div>
  )
}