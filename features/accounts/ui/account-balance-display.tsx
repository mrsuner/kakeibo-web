'use client'

interface Balance {
  id?: string
  currencyId?: string
  currencyCode: string
  balance: number
}

interface AccountBalanceDisplayProps {
  showCurrencyDetails: boolean
  balance?: number
  baseCurrencyCode?: string
  balances?: Balance[]
}

export function AccountBalanceDisplay({ 
  showCurrencyDetails, 
  balance, 
  baseCurrencyCode,
  balances 
}: AccountBalanceDisplayProps) {
  if (!showCurrencyDetails) {
    // Single Balance View
    return (
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-base-content/70">Total Balance</span>
          <div className="flex-1"></div>
          <span className="text-xs text-base-content/50">{baseCurrencyCode}</span>
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-primary mt-1 tabular-nums">
          {Number(balance ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </div>
    )
  }

  // Multi-Currency Balance View
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-base-content/70">Currency Balances</span>
        <div className="h-px bg-base-300 flex-1"></div>
      </div>
      {balances && balances.length > 0 ? (
        <div className="grid gap-2">
          {balances.map((b) => (
            <div 
              key={b.id ?? b.currencyId} 
              className="flex items-center justify-between p-3 bg-base-50 rounded-lg border border-base-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{b.currencyCode}</span>
                </div>
                <span className="font-medium text-base-content">{b.currencyCode}</span>
              </div>
              <div className="text-right">
                <div className="font-bold tabular-nums text-base-content">
                  {Number(b.balance ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-base-content/50">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-sm">No currency balances</div>
        </div>
      )}
    </div>
  )
}