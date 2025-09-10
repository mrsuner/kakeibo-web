'use client'

import { Transaction } from '@/lib/store/features/transactionApi'
import TransactionCard from '@/components/domain/transaction/transaction-card'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  error: any
  searchTerm: string
  filterType: 'all' | 'income' | 'expense'
  filterCategory: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onTransactionClick: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  isLoading,
  error,
  searchTerm,
  filterType,
  filterCategory,
  onEdit,
  onDelete,
  onTransactionClick,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-base-100 rounded-xl p-6 shadow-sm border border-base-200 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-base-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-base-300 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-base-300 rounded w-32"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-base-300 rounded w-20 mb-1"></div>
                <div className="h-3 bg-base-300 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">Failed to load transactions</h3>
        <p className="text-base-content/70 mb-6">
          There was an error loading your transactions. Please try again.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-base-100 rounded-xl p-12 text-center shadow-sm">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">No transactions found</h3>
        <p className="text-base-content/70 mb-6">
          {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
            ? "Try adjusting your search or filters"
            : "You haven't recorded any transactions yet"
          }
        </p>
        <a href="/dashboard/add-transaction" className="btn btn-primary">
          Add Your First Transaction
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={() => onTransactionClick(transaction)}
        />
      ))}
    </div>
  )
}