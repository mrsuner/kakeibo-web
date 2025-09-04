'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useGetAccountsQuery } from '@/lib/store/features/accountApi'
import { setSelectedAccount, closeAccountModal } from '@/lib/store/features/transactionFormSlice'
import type { Account } from '@/lib/store/features/accountApi'

interface AccountSelectModalProps {
  onAccountSelect?: (account: Account) => void
}

export default function AccountSelectModal({ onAccountSelect }: AccountSelectModalProps) {
  const dispatch = useAppDispatch()
  const { isAccountModalOpen, selectedAccount } = useAppSelector((state) => state.transactionForm)
  const { data: accounts = [], isLoading } = useGetAccountsQuery()

  const handleAccountSelect = (account: Account) => {
    dispatch(setSelectedAccount(account))
    if (onAccountSelect) {
      onAccountSelect(account)
    }
  }

  const handleClose = () => {
    dispatch(closeAccountModal())
  }

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAccountModalOpen) {
        dispatch(closeAccountModal())
      }
    }
    if (isAccountModalOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isAccountModalOpen, dispatch])

  if (!isAccountModalOpen) return null

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return '💳'
      case 'savings':
        return '🏦'
      case 'credit':
        return '💰'
      case 'investment':
        return '📈'
      case 'cash':
        return '💵'
      default:
        return '💼'
    }
  }

  const getAccountTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'badge-primary'
      case 'savings':
        return 'badge-success'
      case 'credit':
        return 'badge-warning'
      case 'investment':
        return 'badge-info'
      case 'cash':
        return 'badge-secondary'
      default:
        return 'badge-ghost'
    }
  }

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-base-100 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-base-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-base-content">Select Account</h2>
                <p className="text-sm text-base-content/70 mt-1">
                  Choose which account this transaction belongs to
                </p>
              </div>
              <button 
                onClick={handleClose}
                className="btn btn-ghost btn-circle"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/70">No accounts found</p>
                <p className="text-sm text-base-content/50 mt-2">
                  Create an account first to start tracking transactions
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountSelect(account)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                      selectedAccount?.id === account.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-base-200 hover:border-primary/50 bg-base-100'
                    }`}
                  >
                    {/* Selected Indicator */}
                    {selectedAccount?.id === account.id && (
                      <div className="absolute top-3 right-3">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 text-primary" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Account Icon */}
                      <div className="text-3xl mt-1">
                        {getAccountTypeIcon(account.type)}
                      </div>

                      {/* Account Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content text-lg truncate pr-8">
                          {account.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`badge badge-sm ${getAccountTypeBadgeColor(account.type)}`}>
                            {account.type}
                          </span>
                          {account.isDefault && (
                            <span className="badge badge-sm badge-outline">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Balance */}
                        <div className="mt-3">
                          <span className="text-sm text-base-content/60">Balance</span>
                          <p className="text-xl font-bold text-base-content">
                            ${account.balance?.toFixed(2) || '0.00'}
                          </p>
                        </div>

                        {/* Description if available */}
                        {account.description && (
                          <p className="text-sm text-base-content/60 mt-2 line-clamp-2">
                            {account.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer - Optional Quick Actions */}
          {accounts.length > 0 && (
            <div className="border-t border-base-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-base-content/60">
                  {selectedAccount 
                    ? `Selected: ${selectedAccount.name}` 
                    : 'No account selected'}
                </p>
                <button 
                  onClick={handleClose}
                  className="btn btn-primary btn-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}