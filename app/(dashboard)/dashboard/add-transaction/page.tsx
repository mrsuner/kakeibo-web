'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetCategoriesQuery } from '@/lib/store/features/categoryApi'
import { useGetAccountsQuery } from '@/lib/store/features/accountApi'
import { useCreateTransactionMutation } from '@/lib/store/features/transactionApi'

export default function AddTransactionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    necessityRating: '3',
    notes: ''
  })

  const [message, setMessage] = useState('')

  // API hooks
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery({ 
    type: formData.type 
  })
  const { data: accounts = [], isLoading: accountsLoading } = useGetAccountsQuery()
  const [createTransaction, { isLoading: isSubmitting }] = useCreateTransactionMutation()

  // Reset category when transaction type changes
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }, [formData.type])

  const necessityLevels = [
    { value: '1', label: 'Essential', color: 'text-error' },
    { value: '2', label: 'Important', color: 'text-warning' },
    { value: '3', label: 'Moderate', color: 'text-info' },
    { value: '4', label: 'Optional', color: 'text-success' },
    { value: '5', label: 'Impulse', color: 'text-secondary' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.category || !formData.account) {
      setMessage('Please fill in all required fields')
      return
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setMessage('Please enter a valid amount')
      return
    }

    setMessage('')

    try {
      await createTransaction({
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        category_id: Number(formData.category),
        account_id: Number(formData.account),
        date: formData.date,
        tags: formData.tags || undefined,
        necessityRating: formData.type === 'expense' ? Number(formData.necessityRating) : undefined,
      }).unwrap()
      
      setMessage('Transaction added successfully!')
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error: any) {
      const errorMessage = error?.data?.meta?.message || 'Failed to add transaction. Please try again.'
      setMessage(errorMessage)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost btn-sm"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-base-content">Add Transaction</h1>
        </div>
        <p className="text-base-content/70">Record a new income or expense transaction</p>
      </div>

      <div className="bg-base-100 rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Transaction Type *</span>
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
                <span className="label-text ml-2">Expense</span>
              </label>
              <label className="cursor-pointer label">
                <input 
                  type="radio" 
                  name="type" 
                  className="radio radio-primary" 
                  checked={formData.type === 'income'}
                  onChange={() => handleInputChange('type', 'income')}
                />
                <span className="label-text ml-2">Income</span>
              </label>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amount *</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-8 focus:input-primary"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date *</span>
              </label>
              <input
                type="date"
                className="input input-bordered focus:input-primary"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description *</span>
            </label>
            <input
              type="text"
              placeholder="What was this transaction for?"
              className="input input-bordered focus:input-primary"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          {/* Category and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category *</span>
              </label>
              <select 
                className="select select-bordered focus:select-primary"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'Select category'}
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Account *</span>
              </label>
              <select 
                className="select select-bordered focus:select-primary"
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value)}
                required
                disabled={accountsLoading}
              >
                <option value="">
                  {accountsLoading ? 'Loading accounts...' : 'Select account'}
                </option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags</span>
              <span className="label-text-alt">Separate with commas</span>
            </label>
            <input
              type="text"
              placeholder="restaurant, lunch, japanese-food"
              className="input input-bordered focus:input-primary"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          {/* Necessity Rating (only for expenses) */}
          {formData.type === 'expense' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Necessity Rating</span>
                <span className="label-text-alt">How necessary was this expense?</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {necessityLevels.map(level => (
                  <label key={level.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="necessityRating"
                      value={level.value}
                      checked={formData.necessityRating === level.value}
                      onChange={(e) => handleInputChange('necessityRating', e.target.value)}
                      className="radio radio-primary radio-sm"
                    />
                    <span className={`ml-2 text-sm font-medium ${level.color}`}>
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Notes</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 focus:textarea-primary"
              placeholder="Additional notes or context..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            ></textarea>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                {message.includes('success') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="btn btn-outline flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isSubmitting || categoriesLoading || accountsLoading}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                `Add ${formData.type === 'expense' ? 'Expense' : 'Income'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}