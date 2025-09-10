'use client'

import { AccountCard } from './account-card'

interface Balance {
  id?: string
  currencyId?: string
  currencyCode: string
  balance: number
}

interface Account {
  id: string
  name: string
  type: string
  balance?: number
  baseCurrencyCode?: string
  balances?: Balance[]
  description?: string
  creditLimit?: number
  isActive: boolean
}

interface AccountsGridProps {
  accounts: Account[]
  showCurrencyDetails: boolean
  onEditAccount: (account: Account) => void
  onToggleAccount: (accountId: string) => void
}

export function AccountsGrid({ 
  accounts, 
  showCurrencyDetails, 
  onEditAccount, 
  onToggleAccount 
}: AccountsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {accounts.map(account => (
        <AccountCard
          key={account.id}
          account={account}
          showCurrencyDetails={showCurrencyDetails}
          onEdit={onEditAccount}
          onToggle={onToggleAccount}
        />
      ))}
    </div>
  )
}