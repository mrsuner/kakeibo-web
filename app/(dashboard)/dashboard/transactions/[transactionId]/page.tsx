'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useGetTransactionQuery } from '@/lib/store/features/transactionApi'
import TransactionEditModal from '@/components/domain/transaction/transaction-edit-modal'

export default function TransactionShowPage() {
  const params = useParams()
  const router = useRouter()
  const transactionId = params.transactionId as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: transaction, error, isLoading } = useGetTransactionQuery(transactionId)

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
  }

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Time'
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Time'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="alert alert-error mb-6">
          <span>Transaction not found or failed to load. Please try again.</span>
        </div>
        <button 
          onClick={() => router.push('/dashboard/transactions')} 
          className="btn btn-outline"
        >
          ← Back to Transactions
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header with Navigation */}
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => router.push('/dashboard/transactions')} 
          className="btn btn-ghost btn-sm"
        >
          ← Back to Transactions
        </button>
        <div>
          <h1 className="text-3xl font-bold text-base-content">Transaction Details</h1>
          <p className="text-base-content/70 mt-1">View and manage transaction information</p>
        </div>
      </div>

      {/* Transaction Details Card */}
      <div className="bg-base-100 rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              transaction.flow_type === 'income' 
                ? 'bg-success/10' 
                : 'bg-error/10'
            }`}>
              {transaction.category?.icon ? (
                <span className="text-2xl">{transaction.category.icon}</span>
              ) : (
                <svg 
                  className={`w-6 h-6 ${
                    transaction.flow_type === 'income' 
                      ? 'text-success' 
                      : 'text-error'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {transaction.flow_type === 'income' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  )}
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">{transaction.description}</h2>
              <p className="text-base-content/70 text-lg">{transaction.category?.name || 'Uncategorized'}</p>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleOpenEditModal}
          >
            Edit Transaction
          </button>
        </div>

        {/* Amount */}
        <div className="text-center mb-8 p-6 bg-base-200 rounded-lg">
          <p className={`text-5xl font-bold ${
            transaction.flow_type === 'income' ? 'text-success' : 'text-error'
          }`}>
            {transaction.flow_type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount, transaction.currency_code)}
          </p>
          {transaction.converted_amount && transaction.converted_amount !== transaction.amount && (
            <p className="text-base-content/70 mt-3 text-lg">
              Converted: {formatCurrency(transaction.converted_amount, transaction.currency_code)}
            </p>
          )}
        </div>

        {/* Transaction Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Date and Time */}
          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="font-semibold text-base-content mb-4 text-lg">Transaction Date & Time</h3>
            <div className="space-y-4">
              <div>
                <p className="text-base-content/70 text-sm">Date</p>
                <p className="font-medium text-lg">{formatDate(transaction.transaction_at)}</p>
              </div>
              <div>
                <p className="text-base-content/70 text-sm">Time</p>
                <p className="font-medium text-lg">{formatTime(transaction.transaction_at)}</p>
              </div>
            </div>
          </div>

          {/* Account and Category */}
          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="font-semibold text-base-content mb-4 text-lg">Account & Category</h3>
            <div className="space-y-4">
              <div>
                <p className="text-base-content/70 text-sm">Account</p>
                <p className="font-medium text-lg">{transaction.account?.name || 'Unknown Account'}</p>
              </div>
              <div>
                <p className="text-base-content/70 text-sm">Category</p>
                <div className="flex items-center space-x-2">
                  {transaction.category?.icon && (
                    <span className="text-xl">{transaction.category.icon}</span>
                  )}
                  <span className="font-medium text-lg">{transaction.category?.name || 'Uncategorized'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(transaction.necessity_rating || transaction.balance_after !== null) && (
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="font-semibold text-base-content mb-4 text-lg">Additional Information</h3>
              <div className="space-y-4">
                {transaction.necessity_rating && (
                  <div>
                    <p className="text-base-content/70 text-sm">Necessity Rating</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="rating rating-md">
                        {[...Array(10)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            className="mask mask-star-2 bg-orange-400"
                            checked={i < (transaction.necessity_rating || 0)}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="font-medium text-lg">{transaction.necessity_rating}/10</span>
                    </div>
                  </div>
                )}
                {transaction.balance_after !== null && (
                  <div>
                    <p className="text-base-content/70 text-sm">Balance After</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(transaction.balance_after, transaction.currency_code)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="font-semibold text-base-content mb-4 text-lg">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {transaction.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="badge badge-lg badge-outline"
                    style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Files */}
        {transaction.files && transaction.files.length > 0 && (
          <div className="bg-base-200 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-base-content mb-4 text-lg">Attachments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transaction.files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-base-100 rounded-lg">
                  <svg className="w-6 h-6 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{file.filename || `File ${file.file_id}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Edit Modal */}
      <TransactionEditModal
        transaction={transaction}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}