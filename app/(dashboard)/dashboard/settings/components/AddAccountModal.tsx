'use client'

import { useState } from 'react'
import { type Account, type CreateAccountRequest } from '@/lib/store/features/accountApi'

interface AddAccountModalProps {
  onClose: () => void
  onSave: (account: CreateAccountRequest) => void
}

export default function AddAccountModal({ onClose, onSave }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: '',
    description: '',
    creditLimit: '',
    billingCycleDay: '',
    paymentDueDay: '',
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const accountTypes = [
    { value: 'bank', label: 'Bank Account', icon: '🏦' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'debit-card', label: 'Debit Card', icon: '💳' },
    { value: 'credit-card', label: 'Credit Card', icon: '💳' }
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
      newErrors.name = 'Account name is required'
    }

    if (!formData.balance) {
      newErrors.balance = 'Balance is required'
    } else if (isNaN(Number(formData.balance))) {
      newErrors.balance = 'Balance must be a valid number'
    }

    if (formData.type === 'credit-card') {
      if (!formData.creditLimit) {
        newErrors.creditLimit = 'Credit limit is required for credit cards'
      } else if (isNaN(Number(formData.creditLimit)) || Number(formData.creditLimit) <= 0) {
        newErrors.creditLimit = 'Credit limit must be a positive number'
      }

      if (formData.billingCycleDay && (isNaN(Number(formData.billingCycleDay)) || Number(formData.billingCycleDay) < 1 || Number(formData.billingCycleDay) > 31)) {
        newErrors.billingCycleDay = 'Billing cycle day must be between 1 and 31'
      }

      if (formData.paymentDueDay && (isNaN(Number(formData.paymentDueDay)) || Number(formData.paymentDueDay) < 1 || Number(formData.paymentDueDay) > 31)) {
        newErrors.paymentDueDay = 'Payment due day must be between 1 and 31'
      }
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

      const newAccount: CreateAccountRequest = {
        name: formData.name.trim(),
        type: formData.type,
        balance: Number(formData.balance),
        description: formData.description.trim() || undefined,
        ...(formData.type === 'credit-card' && {
          creditLimit: Number(formData.creditLimit),
          billingCycleDay: formData.billingCycleDay ? Number(formData.billingCycleDay) : undefined,
          paymentDueDay: formData.paymentDueDay ? Number(formData.paymentDueDay) : undefined
        })
      }

      onSave(newAccount)
    } catch (error) {
      console.error('Failed to create account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Add New Account</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Account Name *</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Chase Checking"
              className={`input input-bordered ${errors.name ? 'input-error' : 'focus:input-primary'}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <label className="label"><span className="label-text-alt text-error">{errors.name}</span></label>}
          </div>

          {/* Account Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Account Type *</span>
            </label>
            <select 
              className="select select-bordered focus:select-primary"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Balance */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                {formData.type === 'credit-card' ? 'Current Balance *' : 'Initial Balance *'}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`input input-bordered w-full pl-8 ${errors.balance ? 'input-error' : 'focus:input-primary'}`}
                value={formData.balance}
                onChange={(e) => handleInputChange('balance', e.target.value)}
              />
            </div>
            {errors.balance && <label className="label"><span className="label-text-alt text-error">{errors.balance}</span></label>}
          </div>

          {/* Credit Card Specific Fields */}
          {formData.type === 'credit-card' && (
            <>
              {/* Credit Limit */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Credit Limit *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`input input-bordered w-full pl-8 ${errors.creditLimit ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.creditLimit}
                    onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                  />
                </div>
                {errors.creditLimit && <label className="label"><span className="label-text-alt text-error">{errors.creditLimit}</span></label>}
              </div>

              {/* Billing Cycle Day */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Billing Cycle Day</span>
                    <span className="label-text-alt">Day of month (1-31)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="15"
                    className={`input input-bordered ${errors.billingCycleDay ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.billingCycleDay}
                    onChange={(e) => handleInputChange('billingCycleDay', e.target.value)}
                  />
                  {errors.billingCycleDay && <label className="label"><span className="label-text-alt text-error">{errors.billingCycleDay}</span></label>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Payment Due Day</span>
                    <span className="label-text-alt">Day of month (1-31)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="25"
                    className={`input input-bordered ${errors.paymentDueDay ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.paymentDueDay}
                    onChange={(e) => handleInputChange('paymentDueDay', e.target.value)}
                  />
                  {errors.paymentDueDay && <label className="label"><span className="label-text-alt text-error">{errors.paymentDueDay}</span></label>}
                </div>
              </div>
            </>
          )}

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-20 focus:textarea-primary"
              placeholder="Optional description for this account..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Active Status */}
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text font-medium">Account Status</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                {formData.isActive ? 'Active - account will be visible in transaction forms' : 'Inactive - account will be hidden from transaction forms'}
              </span>
            </label>
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
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}