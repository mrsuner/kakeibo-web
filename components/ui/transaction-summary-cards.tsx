'use client'

interface TransactionSummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  netAmount: number
}

export function TransactionSummaryCards({
  totalIncome,
  totalExpenses,
  netAmount,
}: TransactionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content/70 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-success">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-success/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content/70 text-sm">Total Expenses</p>
            <p className="text-2xl font-bold text-error">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-error/10 p-3 rounded-full">
            <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base-content/70 text-sm">Net Amount</p>
            <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-success' : 'text-error'}`}>
              ${netAmount.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 rounded-full ${netAmount >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
            <svg className={`w-6 h-6 ${netAmount >= 0 ? 'text-success' : 'text-error'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}