'use client'

interface TransactionPaginationProps {
  hasTransactions: boolean
}

export function TransactionPagination({ hasTransactions }: TransactionPaginationProps) {
  if (!hasTransactions) {
    return null
  }

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        <button className="join-item btn btn-disabled">«</button>
        <button className="join-item btn btn-active">1</button>
        <button className="join-item btn btn-disabled">»</button>
      </div>
    </div>
  )
}