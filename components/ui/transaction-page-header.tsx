'use client'

export function TransactionPageHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Transactions</h1>
          <p className="text-base-content/70 mt-1">
            View and manage all your financial transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-outline btn-sm">
            Export
          </button>
          <a href="/dashboard/add-transaction" className="btn btn-primary btn-sm">
            + Add Transaction
          </a>
        </div>
      </div>
    </div>
  )
}