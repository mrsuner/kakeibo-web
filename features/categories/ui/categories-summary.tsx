interface CategoriesSummaryProps {
  total: number
  incomeCount: number
  expenseCount: number
}

export function CategoriesSummary({ total, incomeCount, expenseCount }: CategoriesSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <p className="text-base-content/70 text-sm">Total Categories</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <p className="text-base-content/70 text-sm">Income</p>
        <p className="text-2xl font-bold text-success">{incomeCount}</p>
      </div>
      <div className="bg-base-100 rounded-xl p-6 shadow-sm">
        <p className="text-base-content/70 text-sm">Expenses</p>
        <p className="text-2xl font-bold text-error">{expenseCount}</p>
      </div>
    </div>
  )
}