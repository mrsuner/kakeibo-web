'use client'

import { useState } from 'react'

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

interface AddCategoryModalProps {
  onClose: () => void
  onSave: (category: Omit<Category, 'id'>) => void
  userCurrency?: string
}

export default function AddCategoryModal({ onClose, onSave, userCurrency = 'USD' }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#ea580c',
    icon: '',
    budget: '',
    budgetPeriod: 'monthly',
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const predefinedColors = [
    '#ea580c', '#dc2626', '#c2410c', '#7c2d12', // Reds/Oranges
    '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', // Blues
    '#16a34a', '#15803d', '#166534', '#14532d', // Greens
    '#7c3aed', '#6d28d9', '#5b21b6', '#581c87', // Purples
    '#0891b2', '#0e7490', '#155e75', '#164e63', // Teals
    '#eab308', '#ca8a04', '#a16207', '#854d0e', // Yellows
    '#e11d48', '#be185d', '#9f1239', '#881337', // Pinks
    '#6b7280', '#4b5563', '#374151', '#1f2937'  // Grays
  ]

  const budgetPeriods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  const categoryIcons = [
    '🍔', '🚗', '🏠', '💊', '🎓', '🎬', '👕', '⚡', '📱', '💰',
    '💼', '🎯', '🏦', '💳', '📈', '🎁', '🛒', '✈️', '🏥', '🎪'
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0)) {
      newErrors.budget = 'Budget must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newCategory: Omit<Category, 'id'> = {
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        icon: formData.icon || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        budgetPeriod: formData.budget ? formData.budgetPeriod : undefined,
        isActive: formData.isActive
      }

      onSave(newCategory)
    } catch (error) {
      console.error('Failed to create category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Category</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Food, Salary, Entertainment"
              className={`input input-bordered ${errors.name ? 'input-error' : 'focus:input-primary'}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <label className="label"><span className="label-text-alt text-error">{errors.name}</span></label>}
          </div>

          {/* Category Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Category Type *</span>
            </label>
            <div className="flex gap-4">
              <label className="cursor-pointer label">
                <input 
                  type="radio" 
                  name="type" 
                  className="radio radio-primary" 
                  checked={formData.type === 'expense'}
                  onChange={() => handleInputChange('type', 'expense')}
                />
                <span className="label-text ml-2">💸 Expense</span>
              </label>
              <label className="cursor-pointer label">
                <input 
                  type="radio" 
                  name="type" 
                  className="radio radio-primary" 
                  checked={formData.type === 'income'}
                  onChange={() => handleInputChange('type', 'income')}
                />
                <span className="label-text ml-2">💰 Income</span>
              </label>
            </div>
          </div>

          {/* Color Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Color *</span>
            </label>
            <div className="grid grid-cols-8 gap-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-base-content scale-110' 
                      : 'border-base-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-base-content/70">Custom:</span>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-8 h-8 rounded border border-base-300"
              />
            </div>
          </div>

          {/* Icon Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Icon (Optional)</span>
            </label>
            <div className="grid grid-cols-10 gap-2 mb-2">
              {categoryIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`btn btn-sm ${
                    formData.icon === icon 
                      ? 'btn-primary' 
                      : 'btn-ghost'
                  }`}
                  onClick={() => handleInputChange('icon', formData.icon === icon ? '' : icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type a custom emoji"
              className="input input-bordered input-sm"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              maxLength={2}
            />
          </div>

          {/* Budget (Optional) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                {formData.type === 'expense' ? 'Budget (Optional)' : 'Target Amount (Optional)'}
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70">{userCurrency}</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`input input-bordered w-full pl-12 ${errors.budget ? 'input-error' : 'focus:input-primary'}`}
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>
              <select 
                className="select select-bordered focus:select-primary"
                value={formData.budgetPeriod}
                onChange={(e) => handleInputChange('budgetPeriod', e.target.value)}
                disabled={!formData.budget}
              >
                {budgetPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.budget && <label className="label"><span className="label-text-alt text-error">{errors.budget}</span></label>}
          </div>

          {/* Active Status */}
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text font-medium">Category Status</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                {formData.isActive ? 'Active - category will be available in transaction forms' : 'Inactive - category will be hidden from transaction forms'}
              </span>
            </label>
          </div>

          {/* Preview */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Preview</span>
            </label>
            <div className="flex items-center gap-3 p-3 border border-base-300 rounded-lg bg-base-50">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              ></div>
              <span className="font-medium">
                {formData.icon && `${formData.icon} `}
                {formData.name || 'Category Name'}
              </span>
              <span className={`badge badge-outline badge-sm ${formData.type === 'expense' ? 'badge-error' : 'badge-success'}`}>
                {formData.type}
              </span>
              {formData.budget && (
                <span className="text-xs text-base-content/60">
                  {userCurrency} {Number(formData.budget).toLocaleString()}/{formData.budgetPeriod}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}