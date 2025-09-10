'use client'

interface AccountsEmptyStateProps {
  onAddAccount: () => void
}

export function AccountsEmptyState({ onAddAccount }: AccountsEmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">💰</div>
      <h2 className="text-xl sm:text-2xl font-medium text-base-content mb-2 sm:mb-3">
        No accounts yet
      </h2>
      <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6 max-w-md mx-auto px-4">
        Get started by adding your first financial account to begin tracking your finances
      </p>
      <button 
        onClick={onAddAccount}
        className="btn btn-primary btn-md sm:btn-lg"
      >
        Add Your First Account
      </button>
    </div>
  )
}