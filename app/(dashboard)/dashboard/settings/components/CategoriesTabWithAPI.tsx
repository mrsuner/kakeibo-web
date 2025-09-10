'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'
import CategoryList from './CategoryList'
import CategorySummary from './CategorySummary'
import { 
  useGetCategoriesQuery, 
  useToggleCategoryMutation,
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
  type Category,
  type CreateCategoryDto,
  type UpdateCategoryDto
} from '@/features/categories'

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
        <CategoryList
          type="expense"
          categories={expenseCategories}
          userCurrency={userCurrency}
          onEditCategory={handleEditCategory}
          onToggleCategory={handleCategoryToggle}
          onAddCategory={() => setShowAddModal(true)}
        />
        <CategoryList
          type="income"
          categories={incomeCategories}
          userCurrency={userCurrency}
          onEditCategory={handleEditCategory}
          onToggleCategory={handleCategoryToggle}
          onAddCategory={() => setShowAddModal(true)}
        />
      </div>

      <CategorySummary 
        categories={categories}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />

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