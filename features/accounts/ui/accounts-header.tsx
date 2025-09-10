'use client'

interface AccountsHeaderProps {
  showCurrencyDetails: boolean
  onToggleCurrencyDetails: (value: boolean) => void
  onAddAccount: () => void
}

export function AccountsHeader({ 
  showCurrencyDetails, 
  onToggleCurrencyDetails, 
  onAddAccount 
}: AccountsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">My Accounts</h1>
        <p className="text-sm sm:text-base text-base-content/70 mt-1">
          Manage all your financial accounts in one place
        </p>
      </div>
      <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
        <div className="flex items-center gap-2 px-3 py-2 bg-base-200 rounded-lg">
          <svg className="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <span className="text-base-content/70 font-medium">Multi-currency view</span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={showCurrencyDetails}
              onChange={(e) => onToggleCurrencyDetails(e.target.checked)}
            />
          </label>
        </div>
        <button 
          onClick={onAddAccount}
          className="btn btn-primary btn-sm sm:btn-md gap-2 w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Account
        </button>
      </div>
    </div>
  )
}