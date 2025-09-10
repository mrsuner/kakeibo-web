'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setSelectedCategory, closeCategoryModal } from '@/lib/store/features/transactionFormSlice'
import { useGetCategoriesQuery, type Category } from '@/features/categories'

interface CategorySelectModalProps {
  onCategorySelect?: (category: Category) => void
}

export default function CategorySelectModal({ 
  onCategorySelect 
}: CategorySelectModalProps) {
  const dispatch = useAppDispatch()
  const { isCategoryModalOpen, selectedCategory, formData } = useAppSelector((state) => state.transactionForm)
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ type: formData.type })

  const handleCategorySelect = (category: Category) => {
    dispatch(setSelectedCategory(category))
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  const handleClose = () => {
    dispatch(closeCategoryModal())
  }

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCategoryModalOpen) {
        dispatch(closeCategoryModal())
      }
    }
    if (isCategoryModalOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isCategoryModalOpen, dispatch])

  if (!isCategoryModalOpen) return null

  const getCategoryIcon = (icon: string | null | undefined, name: string) => {
    // If there's a custom icon, use it
    if (icon) return icon
    
    // Default icons based on common category names
    const lowerName = name.toLowerCase()
    if (lowerName.includes('food') || lowerName.includes('meal')) return '🍽️'
    if (lowerName.includes('transport') || lowerName.includes('travel')) return '🚗'
    if (lowerName.includes('shopping') || lowerName.includes('shop')) return '🛍️'
    if (lowerName.includes('entertainment') || lowerName.includes('fun')) return '🎮'
    if (lowerName.includes('health') || lowerName.includes('medical')) return '🏥'
    if (lowerName.includes('education') || lowerName.includes('learn')) return '📚'
    if (lowerName.includes('salary') || lowerName.includes('wage')) return '💰'
    if (lowerName.includes('investment') || lowerName.includes('dividend')) return '📈'
    if (lowerName.includes('gift') || lowerName.includes('bonus')) return '🎁'
    if (lowerName.includes('rent') || lowerName.includes('housing')) return '🏠'
    if (lowerName.includes('utilities') || lowerName.includes('bill')) return '💡'
    if (lowerName.includes('insurance')) return '🛡️'
    
    // Default icons for income vs expense
    return formData.type === 'income' ? '💵' : '💸'
  }

  const getCategoryColor = (color: string | null | undefined) => {
    return color || '#FF6B35' // Default to orange if no color
  }

  // Group categories by budget (high budget first) and usage (high hits first)
  const sortedCategories = [...categories].sort((a, b) => {
    // First sort by budget (descending)
    const aBudget = a.budget || 0
    const bBudget = b.budget || 0
    if (aBudget !== bBudget) {
      return bBudget - aBudget
    }
    // Then by hits (descending)
    return (b.hits || 0) - (a.hits || 0)
  })

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-base-100 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-base-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-base-content">
                  Select {formData.type === 'income' ? 'Income' : 'Expense'} Category
                </h2>
                <p className="text-sm text-base-content/70 mt-1">
                  Choose a category for your transaction
                </p>
              </div>
              <button 
                onClick={handleClose}
                className="btn btn-ghost btn-circle"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/70">No categories found</p>
                <p className="text-sm text-base-content/50 mt-2">
                  Create a {formData.type} category first in Settings
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedCategories.map((category) => {
                  const categoryColor = getCategoryColor(category.color)
                  const isSelected = selectedCategory?.id === category.id
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-base-200 hover:border-primary/50 bg-base-100'
                      }`}
                    >
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 text-primary" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        {/* Category Icon */}
                        <div 
                          className="text-3xl p-2 rounded-lg"
                          style={{ 
                            backgroundColor: `${categoryColor}15`,
                            border: `2px solid ${categoryColor}30`
                          }}
                        >
                          {getCategoryIcon(category.icon, category.name)}
                        </div>

                        {/* Category Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base-content text-lg truncate pr-8">
                            {category.name}
                          </h3>
                          
                          <div className="flex items-center gap-2 mt-1">
                            {/* Color indicator */}
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: categoryColor }}
                            />
                            
                            {/* Usage badge */}
                            {category.hits && category.hits > 0 && (
                              <span className="badge badge-xs badge-ghost">
                                Used {category.hits}x
                              </span>
                            )}
                            
                            {/* Default badge */}
                            {category.isDefault && (
                              <span className="badge badge-xs badge-outline">
                                Default
                              </span>
                            )}
                          </div>

                          {/* Budget if set */}
                          {category.budget && category.budget > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-base-content/60">Budget</span>
                              <p className="text-sm font-semibold text-base-content">
                                ${Number(category.budget).toFixed(2)}/{category.budgetPeriod || 'month'}
                              </p>
                            </div>
                          )}

                          {/* Description if available */}
                          {category.description && (
                            <p className="text-xs text-base-content/60 mt-2 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {categories.length > 0 && (
            <div className="border-t border-base-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-base-content/60">
                  {selectedCategory 
                    ? `Selected: ${selectedCategory.name}` 
                    : 'No category selected'}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={handleClose}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleClose}
                    className="btn btn-primary btn-sm"
                    disabled={!selectedCategory}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}