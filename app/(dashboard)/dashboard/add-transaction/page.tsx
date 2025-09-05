'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useCreateTransactionMutation } from '@/lib/store/features/transactionApi'
import { useGetDefaultCategoryQuery } from '@/lib/store/features/categoryApi'
import { useGetDefaultAccountQuery } from '@/lib/store/features/accountApi'
import { 
  resetTransactionForm,
  setAmount,
  setDescription,
  setSubmitting,
  setMessage,
  setFileIds,
  setSelectedCategory,
  setSelectedAccount
} from '@/lib/store/features/transactionFormSlice'
import TransactionTypeSelector from '@/components/domain/transaction/transaction-type-selector'
import AccountSelectModal from '@/components/domain/transaction/account-select-modal'
import CategorySelectModal from '@/components/domain/transaction/category-select-modal'
import CategorySelectCard from '@/components/domain/transaction/category-select-card'
import AccountSelectCard from '@/components/domain/transaction/account-select-card'
import TagInput from '@/components/domain/transaction/tag-input'
import NecessityRating from '@/components/domain/transaction/necessity-rating'
import DatePicker from '@/components/domain/transaction/date-picker'
import FileUpload from '@/components/domain/transaction/file-upload'

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
  const { data: defaultCategory } = useGetDefaultCategoryQuery(formData.type)
  const { data: defaultAccount } = useGetDefaultAccountQuery()

  // Set default category when it's loaded or when type changes
  useEffect(() => {
    if (defaultCategory && !selectedCategory) {
      dispatch(setSelectedCategory(defaultCategory))
    }
  }, [defaultCategory, selectedCategory, dispatch])

  // Set default account when it's loaded
  useEffect(() => {
    if (defaultAccount && !selectedAccount) {
      dispatch(setSelectedAccount(defaultAccount))
    }
  }, [defaultAccount, selectedAccount, dispatch])

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
        file_ids: formData.fileIds.length > 0 ? formData.fileIds : undefined,
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
            disabled={isSubmitting}
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-base-content">Add Transaction</h1>
        </div>
        <p className="text-base-content/70">Record a new income or expense transaction</p>
      </div>

      <div className="bg-base-100 rounded-xl shadow-lg p-8 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-base-100/50 rounded-xl flex items-center justify-center z-10">
              <div className="bg-base-100 rounded-lg p-6 shadow-lg flex items-center gap-3">
                <span className="loading loading-spinner loading-md"></span>
                <span className="text-base-content">Creating transaction...</span>
              </div>
            </div>
          )}

          {/* Transaction Type */}
          <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
            <TransactionTypeSelector />
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
                  onChange={(e) => dispatch(setAmount(e.target.value))}
                  onKeyDown={(e) => {
                    // Allow: backspace, delete, tab, escape, enter, arrow keys, home, end
                    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                      return;
                    }
                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
                      return;
                    }
                    // Allow: numbers 0-9 and decimal point
                    if (!/^[0-9.]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
              <DatePicker />
            </div>
          </div>

          {/* Description */}
          <div className="form-control flex flex-col">
            <label className="label">
              <span className="label-text font-medium">Description *</span>
            </label>
            <textarea
              placeholder="What was this transaction for?"
              className="textarea textarea-bordered h-20 w-full focus:textarea-primary resize-none"
              value={formData.description}
              onChange={(e) => dispatch(setDescription(e.target.value))}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Category and Account */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
            <CategorySelectCard />
            <AccountSelectCard />
          </div>

          {/* Tags */}
          <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
            <TagInput />
          </div>

          {/* Necessity Rating (only for expenses) */}
          <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
            <NecessityRating />
          </div>

          {/* File Upload */}
          <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
            <FileUpload 
              onFilesUploaded={(fileIds) => dispatch(setFileIds(fileIds))}
              maxFiles={5}
            />
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