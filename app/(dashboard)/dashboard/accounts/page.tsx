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
      case 'bank_account': return '🏦'
      case 'cash': return '💵'
      case 'credit_card': return '💳'
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
        creditLimit: updatedAccount.creditLimit,
        billingCycleDay: updatedAccount.billingCycleDay,
        paymentDueDay: updatedAccount.paymentDueDay,
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
        creditLimit: newAccount.creditLimit,
        billingCycleDay: newAccount.billingCycleDay,
        paymentDueDay: newAccount.paymentDueDay,
      }).unwrap()
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  const handleAccountToggle = async (accountId: number) => {
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">My Accounts</h1>
          <p className="text-base-content/70 mt-1">Manage all your financial accounts in one place</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          + Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">💰</div>
          <h2 className="text-2xl font-medium text-base-content mb-3">No accounts yet</h2>
          <p className="text-base-content/70 mb-6 max-w-md mx-auto">
            Get started by adding your first financial account to begin tracking your finances
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-lg"
          >
            Add Your First Account
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {accounts.map(account => (
            <div key={account.id} className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{getAccountTypeIcon(account.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-base-content">{account.name}</h2>
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="btn btn-ghost btn-sm btn-circle"
                          title="Edit account"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-base-content/70 capitalize mb-1">
                        {account.type.replace('-', ' ')} account
                      </p>
                      {account.description && (
                        <p className="text-sm text-base-content/60">{account.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-base-content">
                        ${account.balance.toLocaleString()}
                      </div>
                      {account.type === 'credit_card' && account.creditLimit && (
                        <div className="text-sm text-base-content/60">
                          Credit Limit: ${account.creditLimit.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary toggle-lg" 
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