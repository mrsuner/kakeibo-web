'use client'

import { getAccountTypeIcon } from '../domain/accounts.utils'
import { AccountBalanceDisplay } from './account-balance-display'

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

interface AccountCardProps {
  account: Account
  showCurrencyDetails: boolean
  onEdit: (account: Account) => void
  onToggle: (accountId: string) => void
}

export function AccountCard({ 
  account, 
  showCurrencyDetails, 
  onEdit, 
  onToggle 
}: AccountCardProps) {
  return (
    <div className="bg-base-100 rounded-xl p-4 sm:p-5 shadow-sm border border-base-200 hover:shadow-md transition">
      <div className="flex flex-col gap-4">
        {/* Header with icon, name and edit button */}
        <div className="flex items-start gap-3">
          <div className="text-3xl sm:text-4xl flex-shrink-0">
            {getAccountTypeIcon(account.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-base-content truncate">
                  {account.name}
                </h2>
                <p className="text-xs sm:text-sm text-base-content/70 capitalize">
                  {account.type.replace(/[_-]/g, ' ')} account
                </p>
              </div>
              <button
                onClick={() => onEdit(account)}
                className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
                title="Edit account"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            {account.description && (
              <p className="text-xs sm:text-sm text-base-content/60 mt-1 break-words">
                {account.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Balance Section */}
        <div className="space-y-3">
          <AccountBalanceDisplay 
            showCurrencyDetails={showCurrencyDetails}
            balance={account.balance}
            baseCurrencyCode={account.baseCurrencyCode}
            balances={account.balances}
          />

          {/* Credit Card Info & Status Row */}
          <div className="flex items-center justify-between pt-2 border-t border-base-200">
            <div className="flex-1">
              {account.type === 'credit_card' && account.creditLimit && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-info/10 text-info rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs font-medium">
                    Limit: ${account.creditLimit.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Status Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-base-content/70">
                {account.isActive ? 'Active' : 'Inactive'}
              </span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary toggle-sm" 
                checked={account.isActive}
                onChange={() => onToggle(account.id)}
                title={account.isActive ? 'Deactivate account' : 'Activate account'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}