'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useCreateTransactionMutation } from '@/lib/store/features/transactionApi'
import { 
  openAccountModal, 
  clearSelectedAccount, 
  openCategoryModal,
  clearSelectedCategory,
  resetTransactionForm,
  setAmount,
  setDescription,
  setSubmitting,
  setMessage
} from '@/lib/store/features/transactionFormSlice'
import TransactionTypeSelector from '@/components/domain/transaction/transaction-type-selector'
import AccountSelectModal from '@/components/domain/transaction/account-select-modal'
import CategorySelectModal from '@/components/domain/transaction/category-select-modal'
import TagInput from '@/components/domain/transaction/tag-input'
import NecessityRating from '@/components/domain/transaction/necessity-rating'
import DatePicker from '@/components/domain/transaction/date-picker'

export default function AddTransactionPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { 
    formData,
    selectedAccount, 
    selectedCategory,
    message,
    isSubmitting 
  } = useAppSelector((state) => state.transactionForm)

  // API hooks
  const [createTransaction] = useCreateTransactionMutation()

  // Clean up Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetTransactionForm())
    }
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !selectedCategory || !selectedAccount) {
      dispatch(setMessage('Please fill in all required fields'))
      return
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      dispatch(setMessage('Please enter a valid amount'))
      return
    }

    dispatch(setMessage(''))
    dispatch(setSubmitting(true))

    try {
      await createTransaction({
        type: formData.type,
        amount: Number(formData.amount),
        description: formData.description,
        category_id: selectedCategory.id,
        account_id: selectedAccount.id,
        date: formData.date,
        tags: formData.tags.length > 0 ? formData.tags.join(',') : undefined,
        necessityRating: formData.type === 'expense' ? formData.necessityRating : undefined,
      }).unwrap()
      
      dispatch(setMessage('Transaction added successfully!'))
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      let errorMessage = 'Failed to add transaction. Please try again.'
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error as { data?: { meta?: { message?: string } } }
        errorMessage = errorData.data?.meta?.message || errorMessage
      }
      dispatch(setMessage(errorMessage))
    } finally {
      dispatch(setSubmitting(false))
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
          <TransactionTypeSelector />

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
                  onChange={(e) => dispatch(setAmount(e.target.value))}
                  required
                />
              </div>
            </div>

            <DatePicker />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description *</span>
            </label>
            <textarea
              placeholder="What was this transaction for?"
              className="textarea textarea-bordered h-20 focus:textarea-primary resize-none"
              value={formData.description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              required
            />
          </div>

          {/* Category and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Category *</span>
              </label>
              <button
                type="button"
                onClick={() => dispatch(openCategoryModal())}
                className="btn btn-outline btn-block justify-between hover:btn-primary"
              >
                <div className="flex items-center gap-2">
                  {selectedCategory ? (
                    <>
                      <span className="text-2xl">
                        {selectedCategory.icon || (formData.type === 'income' ? '💵' : '💸')}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold">{selectedCategory.name}</p>
                        {selectedCategory.budget && selectedCategory.budget > 0 && (
                          <p className="text-xs opacity-70">
                            Budget: ${Number(selectedCategory.budget).toFixed(2)}/{selectedCategory.budgetPeriod || 'month'}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-base-content/60">Select a category</span>
                  )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => dispatch(clearSelectedCategory())}
                  className="btn btn-ghost btn-xs mt-2"
                >
                  Clear selection
                </button>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Account *</span>
              </label>
              <button
                type="button"
                onClick={() => dispatch(openAccountModal())}
                className="btn btn-outline btn-block justify-between hover:btn-primary"
              >
                <div className="flex items-center gap-2">
                  {selectedAccount ? (
                    <>
                      <span className="text-2xl">
                        {selectedAccount.type === 'checking' ? '💳' :
                         selectedAccount.type === 'savings' ? '🏦' :
                         selectedAccount.type === 'credit' ? '💰' :
                         selectedAccount.type === 'investment' ? '📈' :
                         selectedAccount.type === 'cash' ? '💵' : '💼'}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold">{selectedAccount.name}</p>
                        <p className="text-xs opacity-70">
                          {selectedAccount.type} • Balance: ${selectedAccount.balance?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-base-content/60">Select an account</span>
                  )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {selectedAccount && (
                <button
                  type="button"
                  onClick={() => dispatch(clearSelectedAccount())}
                  className="btn btn-ghost btn-xs mt-2"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <TagInput />

          {/* Necessity Rating (only for expenses) */}
          <NecessityRating />


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
              disabled={isSubmitting}
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

      {/* Account Select Modal */}
      <AccountSelectModal />
      
      {/* Category Select Modal */}
      <CategorySelectModal />
    </div>
  )
}