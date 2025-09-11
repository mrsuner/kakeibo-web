'use client'

import { useState } from 'react'
import { type CreateAccountRequest, type AccountType } from '@/lib/store/features/accountApi'
import { useGetCurrenciesQuery } from '@/lib/store/api'

interface AddAccountModalProps {
  onClose: () => void
  onSave: (account: CreateAccountRequest) => void
}

export function AddAccountModal({ onClose, onSave }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'savings_account' as AccountType,
    description: '',
    creditLimit: '',
    billingCycleDay: '',
    paymentDueDay: '',
    isActive: true
  })
  const [balances, setBalances] = useState<Array<{ id: string; currency_id: string; balance: string; average_cost?: string }>>([
    { id: crypto.randomUUID(), currency_id: '', balance: '', average_cost: '' }
  ])

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

    // Validate balances list only if provided (optional)
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

      const newAccount: CreateAccountRequest = {
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
        ...(formData.type === 'credit_card' && {
          credit_limit: Number(formData.creditLimit),
          billing_cycle_day: formData.billingCycleDay ? Number(formData.billingCycleDay) : undefined,
          payment_due_day: formData.paymentDueDay ? Number(formData.paymentDueDay) : undefined
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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Initial Balances (moved to bottom) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-base-content">Initial Balances</h4>
                <p className="text-sm text-base-content/70">Set up your account's starting balance in different currencies</p>
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
                          value={b.currency_id}
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
