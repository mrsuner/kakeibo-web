'use client'

import { useState } from 'react'
import AddAccountModal from './AddAccountModal'
import EditAccountModal from './EditAccountModal'

interface Account {
  id: number
  name: string
  type: string
  balance: number
  isActive: boolean
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

interface AccountsTabProps {
  accounts: Account[]
  onAccountToggle: (accountId: number) => void
  onAccountUpdate: (account: Account) => void
  onAccountAdd: (account: Omit<Account, 'id'>) => void
}

export default function AccountsTab({ 
  accounts, 
  onAccountToggle, 
  onAccountUpdate,
  onAccountAdd 
}: AccountsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

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

  const handleAccountUpdate = (updatedAccount: Account) => {
    onAccountUpdate(updatedAccount)
    setEditingAccount(null)
  }

  const handleAccountAdd = (newAccount: Omit<Account, 'id'>) => {
    onAccountAdd(newAccount)
    setShowAddModal(false)
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
                  onChange={() => onAccountToggle(account.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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