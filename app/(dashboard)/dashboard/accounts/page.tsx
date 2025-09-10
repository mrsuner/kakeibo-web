'use client'

import { useState, useEffect } from 'react'
import AddAccountModal from '../settings/components/AddAccountModal'
import EditAccountModal from '../settings/components/EditAccountModal'
import { 
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useToggleAccountMutation,
  type Account,
  type CreateAccountRequest,
  type UpdateAccountRequest
} from '@/lib/store/features/accountApi'

export default function AccountsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const { data: accounts = [], isLoading, error, refetch } = useGetAccountsQuery()
  const [createAccount] = useCreateAccountMutation()
  const [updateAccount] = useUpdateAccountMutation()
  const [toggleAccount] = useToggleAccountMutation()

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'cash': return '💵'
      case 'savings_account':
      case 'savings': return '🏦'
      case 'debit_card':
      case 'debit-card': return '💳'
      case 'credit_card':
      case 'credit-card': return '💳'
      case 'checking': return '🏦'
      case 'e_wallet': return '📱'
      default: return '💰'
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
  }

  const handleAccountUpdate = async (updatedAccount: Account) => {
    try {
      await updateAccount({
        id: updatedAccount.id,
        name: updatedAccount.name,
        type: updatedAccount.type,
        balance: updatedAccount.balance,
        description: updatedAccount.description,
        credit_limit: updatedAccount.creditLimit,
        billing_cycle_day: updatedAccount.billingCycleDay,
        payment_due_day: updatedAccount.paymentDueDay,
      }).unwrap()
      setEditingAccount(null)
    } catch (error) {
      console.error('Failed to update account:', error)
    }
  }

  const handleAccountAdd = async (newAccount: Omit<Account, 'id'>) => {
    try {
      await createAccount({
        name: newAccount.name,
        type: newAccount.type,
        balance: newAccount.balance,
        description: newAccount.description,
        credit_limit: newAccount.creditLimit,
        billing_cycle_day: newAccount.billingCycleDay,
        payment_due_day: newAccount.paymentDueDay,
      }).unwrap()
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const handleAccountToggle = async (accountId: string) => {
    try {
      await toggleAccount(accountId).unwrap()
    } catch (error) {
      console.error('Failed to toggle account:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Error loading accounts</h3>
          <div className="text-xs">Please try again later</div>
        </div>
        <button onClick={() => refetch()} className="btn btn-sm">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">My Accounts</h1>
          <p className="text-sm sm:text-base text-base-content/70 mt-1">Manage all your financial accounts in one place</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
        >
          + Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">💰</div>
          <h2 className="text-xl sm:text-2xl font-medium text-base-content mb-2 sm:mb-3">No accounts yet</h2>
          <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6 max-w-md mx-auto px-4">
            Get started by adding your first financial account to begin tracking your finances
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-md sm:btn-lg"
          >
            Add Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {accounts.map(account => (
            <div key={account.id} className="bg-base-100 rounded-xl p-4 sm:p-5 shadow-sm border border-base-200 hover:shadow-md transition">
              <div className="flex flex-col gap-4">
                {/* Header with icon, name and edit button */}
                <div className="flex items-start gap-3">
                  <div className="text-3xl sm:text-4xl flex-shrink-0">{getAccountTypeIcon(account.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-base-content truncate">{account.name}</h2>
                        <p className="text-xs sm:text-sm text-base-content/70 capitalize">
                          {account.type.replace(/[_-]/g, ' ')} account
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
                        title="Edit account"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    {account.description && (
                      <p className="text-xs sm:text-sm text-base-content/60 mt-1 break-words">{account.description}</p>
                    )}
                  </div>
                </div>
                
                {/* Balance and Credit Info */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xl sm:text-2xl font-bold text-base-content">
                      {account.baseCurrencyCode ?? ''} {Number(account.balance ?? 0).toLocaleString()}
                    </div>
                    {account.type === 'credit_card' && account.creditLimit && (
                      <div className="text-xs sm:text-sm text-base-content/60 mt-1">
                        Limit: ${account.creditLimit.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Status Toggle */}
                  <div className="flex flex-col items-center gap-1">
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={account.isActive}
                      onChange={() => handleAccountToggle(account.id)}
                    />
                    <span className="text-xs text-base-content/60">
                      {account.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAccountAdd}
        />
      )}

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSave={handleAccountUpdate}
        />
      )}
    </div>
  )
}
