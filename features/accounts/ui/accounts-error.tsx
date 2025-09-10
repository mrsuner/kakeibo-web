'use client'

interface AccountsErrorProps {
  onRetry: () => void
}

export function AccountsError({ onRetry }: AccountsErrorProps) {
  return (
    <div className="alert alert-error">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="font-bold">Error loading accounts</h3>
        <div className="text-xs">Please try again later</div>
      </div>
      <button onClick={onRetry} className="btn btn-sm">
        Retry
      </button>
    </div>
  )
}