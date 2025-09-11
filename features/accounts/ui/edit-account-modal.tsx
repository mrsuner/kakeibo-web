'use client'

import { useState, useEffect } from 'react'
import { type Account, type AccountType } from '@/lib/store/features/accountApi'
import { useGetCurrenciesQuery } from '@/lib/store/api'

interface EditAccountModalProps {
  account: Account
  onClose: () => void
  onSave: (account: Account) => void
}

export function EditAccountModal({ account, onClose, onSave }: EditAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'savings_account' as AccountType,
    description: '',
    creditLimit: '',
    billingCycleDay: '',
    paymentDueDay: '',
    isActive: true
  })
  const [balances, setBalances] = useState<Array<{ id: string; currency_id: string; balance: string; average_cost?: string }>>([])
  const [originalBalances, setOriginalBalances] = useState<Array<{ id: string; currency_id: string; balance: string; average_cost?: string }>>([])
  const [showBalanceWarning, setShowBalanceWarning] = useState(false)

  const { data: currencies = [] } = useGetCurrenciesQuery()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const accountTypes = [
    { value: 'cash' as AccountType, label: 'Cash', icon: '💵' },
    { value: 'savings_account' as AccountType, label: 'Savings Account', icon: '🏦' },
    { value: 'debit_card' as AccountType, label: 'Debit Card', icon: '💳' },
    { value: 'credit_card' as AccountType, label: 'Credit Card', icon: '💳' },
    { value: 'e_wallet' as AccountType, label: 'E-Wallet', icon: '📱' }
  ]

  // Initialize form with account data
  useEffect(() => {
    setFormData({
      name: account.name,
      type: account.type,
      description: account.description || '',
      creditLimit: account.creditLimit?.toString() || '',
      billingCycleDay: account.billingCycleDay?.toString() || '',
      paymentDueDay: account.paymentDueDay?.toString() || '',
      isActive: account.isActive
    })

    // Initialize balances from account data - ensure currency_id is properly formatted
    const accountBalances = account.balances?.length ? account.balances.map(b => ({
      id: crypto.randomUUID(),
      currency_id: String((b as any).currency_id ?? b.currencyId), // Use normalized currencyId from API
      balance: String(b.balance),
      average_cost: (b as any).average_cost ? String((b as any).average_cost) : ''
    })) : [{ 
      id: crypto.randomUUID(), 
      currency_id: '', // Empty by default, user needs to select
      balance: account.balance?.toString() || '0', 
      average_cost: '' 
    }]

    setBalances(accountBalances)
    setOriginalBalances(JSON.parse(JSON.stringify(accountBalances)))
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

  // Check if balances have been modified
  const balancesModified = () => {
    if (balances.length !== originalBalances.length) return true
    return balances.some((balance, idx) => {
      const original = originalBalances[idx]
      return !original || 
        balance.currency_id !== original.currency_id ||
        balance.balance !== original.balance ||
        balance.average_cost !== original.average_cost
    })
  }

  // Handle balance changes and show warning
  useEffect(() => {
    setShowBalanceWarning(balancesModified())
  }, [balances])

  // Re-initialize balances when currencies are loaded to ensure proper matching
  useEffect(() => {
    if (currencies.length > 0 && account.balances?.length) {
      const accountBalances = account.balances.map(b => ({
        id: crypto.randomUUID(),
        currency_id: String((b as any).currency_id ?? b.currencyId),
        balance: String(b.balance),
        average_cost: (b as any).average_cost ? String((b as any).average_cost) : ''
      }))
      
      // Only update if the current balances don't already have the right currency_ids
      const currentCurrencyIds = balances.map(b => b.currency_id).filter(Boolean)
      const accountCurrencyIds = accountBalances.map(b => b.currency_id)
      
      if (currentCurrencyIds.length === 0 || 
          !accountCurrencyIds.every(id => currentCurrencyIds.includes(id))) {
        setBalances(accountBalances)
        setOriginalBalances(JSON.parse(JSON.stringify(accountBalances)))
      }
    }
  }, [currencies, account.balances])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    }

    // Validate balances list
    if (balances.length) {
      const used = new Set<string>()
      balances.forEach((b, idx) => {
        if (!b.currency_id) newErrors[`balances.${idx}.currency_id`] = 'Currency is required'
        if (!b.balance) newErrors[`balances.${idx}.balance`] = 'Balance is required'
        else if (isNaN(Number(b.balance))) newErrors[`balances.${idx}.balance`] = 'Balance must be a number'
        if (b.average_cost && isNaN(Number(b.average_cost))) newErrors[`balances.${idx}.average_cost`] = 'Average cost must be a number'
        if (b.currency_id) {
          if (used.has(b.currency_id)) newErrors[`balances.${idx}.currency_id`] = 'Duplicate currency'
          used.add(b.currency_id)
        }
      })
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
        ...(balances.length ? {
          balances: balances.map(b => ({
            currency_id: b.currency_id,
            balance: Number(b.balance),
            ...(b.average_cost ? { average_cost: Number(b.average_cost) } : {})
          }))
        } : {}),
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
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-4 sm:py-6 space-y-6">
            {/* Basic Account Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-base-content">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Account Type - Disabled */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Account Type</span>
                    <span className="label-text-alt">Cannot be changed</span>
                  </label>
                  <select 
                    className="select select-bordered bg-base-200 cursor-not-allowed"
                    value={formData.type}
                    disabled
                  >
                    {accountTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-20 focus:textarea-primary"
                  placeholder="Optional description for this account..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Active Status */}
              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Account Status</span>
                    <div className="label-text-alt text-wrap">
                      {formData.isActive ? 'Active - account will be visible in transaction forms' : 'Inactive - account will be hidden from transaction forms'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Credit Card Specific Fields */}
            {formData.type === 'credit_card' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-base-content">Credit Card Details</h4>
                
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
              </div>
            )}

            {/* Balance Warning */}
            {showBalanceWarning && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="font-bold">Balance Changes Detected</h3>
                  <div className="text-xs">You have modified the account balances. This will update your account's financial records and may affect transaction history.</div>
                </div>
              </div>
            )}

            {/* Account Balances */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-base-content">Account Balances</h4>
                  <p className="text-sm text-base-content/70">Manage your account's balance in different currencies</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setBalances(prev => [...prev, { id: crypto.randomUUID(), currency_id: '', balance: '', average_cost: '' }])}
                >
                  + Add Currency
                </button>
              </div>
              
              <div className="space-y-3">
                {balances.map((b, idx) => (
                  <div key={b.id} className="card bg-base-100 border border-base-200 shadow-sm">
                    <div className="card-body p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Currency */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Currency *</span>
                          </label>
                          <select
                            className={`select select-bordered ${errors[`balances.${idx}.currency_id`] ? 'select-error' : 'focus:select-primary'}`}
                            value={b.currency_id || ''}
                            onChange={(e) => setBalances(prev => prev.map((x,i) => i===idx ? { ...x, currency_id: e.target.value } : x))}
                          >
                            <option value="">Select currency</option>
                            {currencies.map(c => (
                              <option key={c.id} value={String(c.id)}>{c.code} — {c.name}</option>
                            ))}
                          </select>
                          {errors[`balances.${idx}.currency_id`] && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errors[`balances.${idx}.currency_id`]}</span>
                            </label>
                          )}
                        </div>
                        
                        {/* Balance */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Balance *</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={`input input-bordered ${errors[`balances.${idx}.balance`] ? 'input-error' : 'focus:input-primary'}`}
                            value={b.balance}
                            onChange={(e) => setBalances(prev => prev.map((x,i) => i===idx ? { ...x, balance: e.target.value } : x))}
                          />
                          {errors[`balances.${idx}.balance`] && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errors[`balances.${idx}.balance`]}</span>
                            </label>
                          )}
                        </div>
                        
                        {/* Average Cost (optional) */}
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Average Cost</span>
                            <span className="label-text-alt">Optional</span>
                          </label>
                          <input
                            type="number"
                            step="0.00000001"
                            placeholder="Auto from system rate"
                            className={`input input-bordered ${errors[`balances.${idx}.average_cost`] ? 'input-error' : 'focus:input-primary'}`}
                            value={b.average_cost ?? ''}
                            onChange={(e) => setBalances(prev => prev.map((x,i) => i===idx ? { ...x, average_cost: e.target.value } : x))}
                          />
                          {errors[`balances.${idx}.average_cost`] && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errors[`balances.${idx}.average_cost`]}</span>
                            </label>
                          )}
                        </div>
                      </div>
                      
                      {balances.length > 1 && (
                        <div className="flex justify-end mt-3">
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                            onClick={() => setBalances(prev => prev.filter((_,i) => i!==idx))}
                          >
                            Remove Currency
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
