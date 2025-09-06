'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGetTransactionsQuery, useDeleteTransactionMutation, Transaction } from '@/lib/store/features/transactionApi'
import TransactionCard from '@/components/domain/transaction/transaction-card'
import TransactionDetailsModal from '@/components/domain/transaction/transaction-details-modal'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'transaction_at' | 'amount'>('transaction_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      // Reset to first page when search changes
      if (searchTerm !== debouncedSearchTerm) {
        setPage(1)
      }
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timer)
  }, [searchTerm, debouncedSearchTerm])

  // API calls - use debounced search term
  const { data: transactionsData, error, isLoading } = useGetTransactionsQuery({
    search: debouncedSearchTerm || undefined,
    type: filterType === 'all' ? undefined : filterType,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    limit: 15,
  })

  const [deleteTransaction] = useDeleteTransactionMutation()

  // Extract data from API response
  const transactions = transactionsData?.transactions || []
  const summary = transactionsData?.summary
  const pagination = transactionsData?.pagination

  // Check if search is pending (user has typed but debounce hasn't triggered yet)
  const isSearchPending = searchTerm !== debouncedSearchTerm

  // Filter transactions by category (since category filtering isn't implemented in API yet)
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = filterCategory === 'all' || transaction.category?.name === filterCategory
    return matchesCategory
  })

  // Get unique categories from transactions for filter dropdown
  const uniqueCategories = Array.from(
    new Set(transactions.map(t => t.category?.name).filter(Boolean))
  )

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filterType, filterCategory, sortBy, sortOrder])

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id)
    // TODO: Navigate to edit page
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id).unwrap()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  // Use summary from API if available, otherwise default to 0
  const totalIncome = summary?.total_income || 0
  const totalExpenses = summary?.total_expenses || 0
  const netAmount = summary?.net_amount || (totalIncome - totalExpenses)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
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

      {/* Summary Cards */}
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

      {/* Filters and Search */}
      <div className="bg-base-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-ghost btn-square btn-sm"
                    title="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <span className="bg-base-200">
                  {isSearchPending ? (
                    <div className="loading loading-spinner loading-sm"></div>
                  ) : (
                    <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </span>
              </div>
              {isSearchPending && (
                <label className="label">
                  <span className="label-text-alt text-base-content/50">Searching...</span>
                </label>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="select select-bordered w-full"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="select select-bordered w-full"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              className="select select-bordered flex-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'transaction_at' | 'amount')}
            >
              <option value="transaction_at">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <button
              className="btn btn-square btn-outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'desc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading State
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
        ) : error ? (
          // Error State
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
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))
        ) : (
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
        )}
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Pagination (Future) */}
      {filteredTransactions.length > 0 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn btn-disabled">«</button>
            <button className="join-item btn btn-active">1</button>
            <button className="join-item btn btn-disabled">»</button>
          </div>
        </div>
      )}
    </div>
  )
}