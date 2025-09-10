'use client'

import { useState, useEffect } from 'react'
import { type Account } from '@/lib/store/features/accountApi'

interface EditAccountModalProps {
  account: Account
  onClose: () => void
  onSave: (account: Account) => void
}

export default function EditAccountModal({ account, onClose, onSave }: EditAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank_account',
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
    { value: 'bank_account', label: 'Bank Account', icon: '🏦' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'credit_card', label: 'Credit Card', icon: '💳' },
    { value: 'e_wallet', label: 'E-Wallet', icon: '📱' }
  ]

  // Initialize form with account data
  useEffect(() => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      description: account.description || '',
      creditLimit: account.creditLimit?.toString() || '',
      billingCycleDay: account.billingCycleDay?.toString() || '',
      paymentDueDay: account.paymentDueDay?.toString() || '',
      isActive: account.isActive
    })
  }, [account])

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

    if (formData.type === 'credit_card') {
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

      const updatedAccount: Account = {
        ...account,
        name: formData.name.trim(),
        type: formData.type,
        balance: Number(formData.balance),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
        ...(formData.type === 'credit_card' ? {
          creditLimit: Number(formData.creditLimit),
          billingCycleDay: formData.billingCycleDay ? Number(formData.billingCycleDay) : undefined,
          paymentDueDay: formData.paymentDueDay ? Number(formData.paymentDueDay) : undefined
        } : {
          creditLimit: undefined,
          billingCycleDay: undefined,
          paymentDueDay: undefined
        })
      }

      onSave(updatedAccount)
    } catch (error) {
      console.error('Failed to update account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.name}"? This action cannot be undone and will affect all related transactions.`
    )
    
    if (confirmed) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, we would call an onDelete function here
        // For now, we'll just close the modal
        onClose()
      } catch (error) {
        console.error('Failed to delete account:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-base-100 px-6 sm:px-8 py-4 sm:py-6 border-b border-base-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg sm:text-xl">Edit Account</h3>
              <p className="text-xs sm:text-sm text-base-content/60 mt-1">Update your account information and settings</p>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Name */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-medium">Account Name</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Chase Checking"
                className={`input input-bordered w-full ${errors.name ? 'input-error' : 'focus:input-primary'}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && (
                <label className="label pt-1">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            {/* Account Type */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-medium">Account Type</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <select 
                className="select select-bordered w-full focus:select-primary"
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
          </div>

          {/* Financial Information Section */}
          <div className="bg-base-200/30 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-base-content/70">Financial Details</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Balance */}
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-medium">
                    {formData.type === 'credit_card' ? 'Current Balance' : 'Current Balance'}
                  </span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={`input input-bordered w-full pl-10 ${errors.balance ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.balance}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                  />
                </div>
                {errors.balance && (
                  <label className="label pt-1">
                    <span className="label-text-alt text-error">{errors.balance}</span>
                  </label>
                )}
              </div>

              {/* Credit Limit - Only for Credit Cards */}
              {formData.type === 'credit_card' && (
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-medium">Credit Limit</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`input input-bordered w-full pl-10 ${errors.creditLimit ? 'input-error' : 'focus:input-primary'}`}
                      value={formData.creditLimit}
                      onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                    />
                  </div>
                  {errors.creditLimit && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">{errors.creditLimit}</span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Credit Card Billing Information */}
            {formData.type === 'credit_card' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-medium">Billing Cycle Day</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Day of month (1-31)"
                    className={`input input-bordered w-full ${errors.billingCycleDay ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.billingCycleDay}
                    onChange={(e) => handleInputChange('billingCycleDay', e.target.value)}
                  />
                  {errors.billingCycleDay && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">{errors.billingCycleDay}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-medium">Payment Due Day</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Day of month (1-31)"
                    className={`input input-bordered w-full ${errors.paymentDueDay ? 'input-error' : 'focus:input-primary'}`}
                    value={formData.paymentDueDay}
                    onChange={(e) => handleInputChange('paymentDueDay', e.target.value)}
                  />
                  {errors.paymentDueDay && (
                    <label className="label pt-1">
                      <span className="label-text-alt text-error">{errors.paymentDueDay}</span>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            {/* Description */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-medium">Description</span>
                <span className="label-text-alt text-base-content/50">Optional</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full focus:textarea-primary resize-none"
                placeholder="Add any notes or details about this account..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              <label className="label pt-1">
                <span className="label-text-alt text-base-content/50">
                  {formData.description.length}/500 characters
                </span>
              </label>
            </div>

            {/* Active Status */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1">Account Status</h4>
                  <p className="text-xs sm:text-sm text-base-content/70">
                    {formData.isActive 
                      ? 'Account is active and visible in transaction forms' 
                      : 'Account is inactive and hidden from transaction forms'}
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-base-200">
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error btn-outline sm:mr-auto"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete Account
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline flex-1 sm:flex-none"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 sm:flex-none min-w-[140px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}