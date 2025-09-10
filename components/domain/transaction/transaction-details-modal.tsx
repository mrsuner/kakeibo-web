'use client'

import { Transaction } from '@/lib/store/features/transactionApi'
import { useEffect, useRef, useState } from 'react'
import TransactionEditModal from './transaction-edit-modal'

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionDetailsModal({ 
  transaction, 
  isOpen, 
  onClose 
}: TransactionDetailsModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal()
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close()
    }
  }, [isOpen])

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleEditSuccess = () => {
    // Close edit modal and potentially refresh data
    setIsEditModalOpen(false)
    // Note: The RTK Query will automatically refetch the data due to cache invalidation
  }

  if (!transaction) return null

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

  return (
    <dialog 
      ref={modalRef} 
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
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
              <h3 className="text-xl font-bold text-base-content">{transaction.description}</h3>
              <p className="text-base-content/70">{transaction.category?.name || 'Uncategorized'}</p>
            </div>
          </div>
          <button 
            className="btn btn-sm btn-circle btn-ghost" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Amount */}
        <div className="text-center mb-8">
          <p className={`text-4xl font-bold ${
            transaction.flow_type === 'income' ? 'text-success' : 'text-error'
          }`}>
            {transaction.flow_type === 'expense' ? '-' : '+'}
            {formatCurrency(transaction.amount, transaction.currency_code)}
          </p>
          {transaction.converted_amount && transaction.converted_amount !== transaction.amount && (
            <p className="text-base-content/70 mt-2">
              Converted: {formatCurrency(transaction.converted_amount, transaction.currency_code)}
            </p>
          )}
        </div>

        {/* Transaction Details */}
        <div className="space-y-6">
          {/* Date and Time */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-base-content mb-2">Transaction Date & Time</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-base-content/70 text-sm">Date</p>
                <p className="font-medium">{formatDate(transaction.transaction_at)}</p>
              </div>
              <div>
                <p className="text-base-content/70 text-sm">Time</p>
                <p className="font-medium">{formatTime(transaction.transaction_at)}</p>
              </div>
            </div>
          </div>

          {/* Account and Category */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-base-content mb-2">Account & Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-base-content/70 text-sm">Account</p>
                <p className="font-medium">{transaction.account?.name || 'Unknown Account'}</p>
              </div>
              <div>
                <p className="text-base-content/70 text-sm">Category</p>
                <div className="flex items-center space-x-2">
                  {transaction.category?.icon && (
                    <span className="text-lg">{transaction.category.icon}</span>
                  )}
                  <span className="font-medium">{transaction.category?.name || 'Uncategorized'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(transaction.necessity_rating || transaction.balance_after !== null) && (
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-semibold text-base-content mb-2">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.necessity_rating && (
                  <div>
                    <p className="text-base-content/70 text-sm">Necessity Rating</p>
                    <div className="flex items-center space-x-2">
                      <div className="rating rating-sm">
                        {[...Array(5)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            className="mask mask-star-2 bg-orange-400"
                            checked={i < (transaction.necessity_rating || 0)}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="font-medium">{transaction.necessity_rating}/5</span>
                      <span className="text-xs text-base-content/60">
                        ({transaction.necessity_rating <= 1 ? 'Essential' :
                         transaction.necessity_rating <= 2 ? 'Important' :
                         transaction.necessity_rating <= 3 ? 'Moderate' :
                         transaction.necessity_rating <= 4 ? 'Optional' : 'Impulse'})
                      </span>
                    </div>
                  </div>
                )}
                {transaction.balance_after !== null && (
                  <div>
                    <p className="text-base-content/70 text-sm">Balance After</p>
                    <p className="font-medium">
                      {formatCurrency(transaction.balance_after, transaction.currency_code)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-semibold text-base-content mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {transaction.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="badge badge-outline"
                    style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {transaction.files && transaction.files.length > 0 && (
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-semibold text-base-content mb-2">Attachments</h4>
              <div className="space-y-2">
                {transaction.files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-2 bg-base-100 rounded">
                    <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{file.filename || `File ${file.file_id}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleOpenEditModal}>
            Edit Transaction
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>

      {/* Transaction Edit Modal */}
      <TransactionEditModal
        transaction={transaction}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </dialog>
  )
}