'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useUpdateTransactionMutation } from '@/lib/store/features/transactionApi'
import { useGetCategoriesQuery } from '@/lib/store/features/categoryApi'
import { useGetAccountsQuery } from '@/lib/store/features/accountApi'
import { Transaction, TransactionCategory, TransactionAccount } from '@/lib/store/features/transactionApi'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

interface TransactionEditModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface EditFormData {
  type: 'income' | 'expense'
  amount: string
  description: string
  date: string
  tags: string
  necessityRating: number
  category_id: string
  account_id: string
}

export default function TransactionEditModal({ 
  transaction, 
  isOpen, 
  onClose,
  onSuccess
}: TransactionEditModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [formData, setFormData] = useState<EditFormData>({
    type: 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    necessityRating: 6,
    category_id: '',
    account_id: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // API hooks
  const [updateTransaction] = useUpdateTransactionMutation()
  const { data: categories = [] } = useGetCategoriesQuery({ type: formData.type })
  const { data: accounts = [] } = useGetAccountsQuery()

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal()
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close()
    }
  }, [isOpen])

  // Initialize form data when transaction changes
  useEffect(() => {
    if (transaction) {
      const transactionDate = new Date(transaction.transaction_at).toISOString().split('T')[0]
      const tagsString = transaction.tags?.map(tag => tag.name).join(', ') || ''
      
      setFormData({
        type: transaction.flow_type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        date: transactionDate,
        tags: tagsString,
        necessityRating: transaction.necessity_rating || 6,
        category_id: transaction.category?.id ? String(transaction.category.id) : '',
        account_id: transaction.account?.id ? String(transaction.account.id) : '',
      })
    }
  }, [transaction])

  const handleInputChange = (field: keyof EditFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setMessage('') // Clear any existing message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!transaction) return

    if (!formData.amount || !formData.description || !formData.category_id || !formData.account_id) {
      setMessage('Please fill in all required fields')
      return
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setMessage('Please enter a valid amount')
      return
    }

    setMessage('')
    setIsSubmitting(true)

    try {
      await updateTransaction({
        id: transaction.id,
        transaction: {
          type: formData.type,
          amount: Number(formData.amount),
          description: formData.description,
          category_id: formData.category_id,
          account_id: formData.account_id,
          date: formData.date,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
          necessityRating: formData.type === 'expense' ? formData.necessityRating : undefined,
        }
      }).unwrap()
      
      setMessage('Transaction updated successfully!')
      onSuccess?.()
      
      // Close modal after success
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      let errorMessage = 'Failed to update transaction. Please try again.'
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error as { data?: { meta?: { message?: string } } }
        errorMessage = errorData.data?.meta?.message || errorMessage
      }
      setMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!transaction) return null

  return (
    <dialog 
      ref={modalRef} 
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-200">
          <div>
            <h3 className="text-2xl font-bold text-base-content">Edit Transaction</h3>
            <p className="text-base-content/60 mt-1">Update your transaction details</p>
          </div>
          <button 
            className="btn btn-sm btn-circle btn-ghost hover:bg-base-200" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-base-100/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
              <div className="bg-base-100 rounded-xl p-8 shadow-2xl flex items-center gap-4 border border-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <span className="text-base-content font-medium">Updating transaction...</span>
              </div>
            </div>
          )}

          {/* Transaction Type */}
          <div className="bg-base-200/50 rounded-xl p-6">
            <div className="form-control">
              <label className="label pb-3">
                <span className="label-text font-semibold text-lg">Transaction Type *</span>
              </label>
              <div className="join w-full">
                <button
                  type="button"
                  className={`btn join-item flex-1 h-14 text-base gap-3 ${formData.type === 'expense' ? 'btn-error' : 'btn-outline hover:btn-error'}`}
                  onClick={() => handleInputChange('type', 'expense')}
                  disabled={isSubmitting}
                >
                  <span className="text-2xl">💸</span>
                  Expense
                </button>
                <button
                  type="button"
                  className={`btn join-item flex-1 h-14 text-base gap-3 ${formData.type === 'income' ? 'btn-success' : 'btn-outline hover:btn-success'}`}
                  onClick={() => handleInputChange('type', 'income')}
                  disabled={isSubmitting}
                >
                  <span className="text-2xl">💵</span>
                  Income
                </button>
              </div>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold">Amount *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/70 font-medium text-lg">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered input-lg w-full pl-10 pr-4 focus:input-primary text-lg font-medium"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold">Date *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-lg focus:input-primary"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-base-200/30 rounded-xl p-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold">Description *</span>
              </label>
              <textarea
                placeholder="What was this transaction for?"
                className="textarea textarea-bordered textarea-lg h-24 focus:textarea-primary resize-none"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Category and Account */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  className="select select-bordered select-lg focus:select-primary"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold">Account *</span>
                </label>
                <select
                  className="select select-bordered select-lg focus:select-primary"
                  value={formData.account_id}
                  onChange={(e) => handleInputChange('account_id', e.target.value)}
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>Select an account</option>
                  {accounts?.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-base-200/30 rounded-xl p-6">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text font-semibold">Tags</span>
                <span className="label-text-alt text-base-content/60">Optional</span>
              </label>
              <input
                type="text"
                placeholder="Enter tags separated by commas (e.g., food, restaurant, dinner)"
                className="input input-bordered input-lg focus:input-primary"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                disabled={isSubmitting}
              />
              <label className="label pt-2">
                <span className="label-text-alt text-base-content/60">Separate multiple tags with commas</span>
              </label>
            </div>
          </div>

          {/* Necessity Rating (only for expenses) */}
          {formData.type === 'expense' && (
            <div className="bg-base-200/30 rounded-xl p-6">
              <div className="form-control">
                <label className="label pb-3">
                  <span className="label-text font-semibold">Necessity Rating</span>
                  <span className="label-text-alt text-base-content/60">How essential was this expense?</span>
                </label>
                <div className="flex items-center gap-6">
                  <Rating
                    style={{ maxWidth: 250 }}
                    value={formData.necessityRating / 2}
                    onChange={(value: number) => handleInputChange('necessityRating', value * 2)}
                    halfFillMode="svg"
                    readOnly={isSubmitting}
                    allowFraction
                    items={5}
                  />
                  <div className="text-sm text-base-content/70 min-w-[80px]">
                    <span className="font-bold text-lg text-base-content">{formData.necessityRating}/10</span>
                    <div className="text-xs mt-1">
                      {formData.necessityRating <= 2 ? 'Essential' :
                       formData.necessityRating <= 4 ? 'Important' :
                       formData.necessityRating <= 6 ? 'Moderate' :
                       formData.necessityRating <= 8 ? 'Optional' : 'Impulse'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} shadow-lg`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                {message.includes('success') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="modal-action pt-8 border-t border-base-200">
            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-lg flex-1 hover:bg-base-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-md"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={isSubmitting}>close</button>
      </form>
    </dialog>
  )
}