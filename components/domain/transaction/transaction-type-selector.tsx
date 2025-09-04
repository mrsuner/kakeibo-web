'use client'

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setTransactionType } from '@/lib/store/features/transactionFormSlice'

export default function TransactionTypeSelector() {
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.transactionForm)

  const handleTypeChange = (type: 'income' | 'expense') => {
    dispatch(setTransactionType(type))
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Transaction Type *</span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] ${
            formData.type === 'expense'
              ? 'border-error bg-error/5 shadow-sm'
              : 'border-base-200 hover:border-error/50 bg-base-100'
          }`}
        >
          {formData.type === 'expense' && (
            <div className="absolute top-2 right-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-error" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-2">
            <span className="text-3xl">💸</span>
            <span className={`font-semibold text-base ${
              formData.type === 'expense' ? 'text-error' : 'text-base-content'
            }`}>
              Expense
            </span>
            <span className="text-xs text-base-content/60">
              Money going out
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] ${
            formData.type === 'income'
              ? 'border-success bg-success/5 shadow-sm'
              : 'border-base-200 hover:border-success/50 bg-base-100'
          }`}
        >
          {formData.type === 'income' && (
            <div className="absolute top-2 right-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-success" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-2">
            <span className="text-3xl">💵</span>
            <span className={`font-semibold text-base ${
              formData.type === 'income' ? 'text-success' : 'text-base-content'
            }`}>
              Income
            </span>
            <span className="text-xs text-base-content/60">
              Money coming in
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}