'use client'

import { useState, useEffect } from 'react'
import AddAccountModal from './AddAccountModal'
import EditAccountModal from './EditAccountModal'
import { 
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useToggleAccountMutation,
  type Account,
  type CreateAccountRequest,
  type UpdateAccountRequest
} from '@/lib/store/features/accountApi'

export default function AccountsTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const { data: accounts = [], isLoading, error, refetch } = useGetAccountsQuery()
  const [createAccount] = useCreateAccountMutation()
  const [updateAccount] = useUpdateAccountMutation()
  const [toggleAccount] = useToggleAccountMutation()

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return '🏦'
      case 'cash': return '💵'
      case 'credit': return '💳'
      case 'debit-card': return '💳'
      case 'credit-card': return '💳'
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Account Management</h2>
          <p className="text-base-content/70 mt-1">Manage your financial accounts and their visibility</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          + Add Account
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-base-content mb-2">No accounts yet</h3>
          <p className="text-base-content/70 mb-4">Get started by adding your first financial account</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Add Your First Account
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="border border-base-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getAccountTypeIcon(account.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base-content">{account.name}</h3>
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="btn btn-ghost btn-xs"
                        title="Edit account"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-base-content/70 capitalize">
                      {account.type.replace('-', ' ')} account
                    </p>
                    {account.description && (
                      <p className="text-xs text-base-content/60 mt-1">{account.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-base-content">
                      ${account.balance.toLocaleString()}
                    </div>
                    {account.type === 'credit-card' && account.creditLimit && (
                      <div className="text-xs text-base-content/60">
                        Credit: ${account.creditLimit.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={account.isActive}
                    onChange={() => handleAccountToggle(account.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAccountAdd}
        />
      )}

      {/* Edit Account Modal */}
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