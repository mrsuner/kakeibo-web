'use client'

import { useState } from 'react'
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
import {
  AccountsHeader,
  AccountsEmptyState,
  AccountsGrid,
  AccountsLoading,
  AccountsError,
  useAccountsViewPreference
} from '@/features/accounts'

export default function AccountsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [showCurrencyDetails, setShowCurrencyDetails] = useAccountsViewPreference()

  const { data: accounts = [], isLoading, error, refetch } = useGetAccountsQuery()
  const [createAccount] = useCreateAccountMutation()
  const [updateAccount] = useUpdateAccountMutation()
  const [toggleAccount] = useToggleAccountMutation()

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
    return <AccountsLoading />
  }

  if (error) {
    return <AccountsError onRetry={refetch} />
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <AccountsHeader 
        showCurrencyDetails={showCurrencyDetails}
        onToggleCurrencyDetails={setShowCurrencyDetails}
        onAddAccount={() => setShowAddModal(true)}
      />

      {accounts.length === 0 ? (
        <AccountsEmptyState onAddAccount={() => setShowAddModal(true)} />
      ) : (
        <AccountsGrid 
          accounts={accounts}
          showCurrencyDetails={showCurrencyDetails}
          onEditAccount={handleEditAccount}
          onToggleAccount={handleAccountToggle}
        />
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
