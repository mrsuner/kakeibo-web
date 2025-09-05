'use client'

import { useState } from 'react'
import TransactionCard from '@/components/domain/transaction/transaction-card'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Mock data - will be replaced with real API calls
  const mockTransactions = [
    {
      id: '1',
      description: 'Monthly Salary',
      amount: 5200.00,
      converted_amount: 5200.00,
      currency_code: 'USD',
      flow_type: 'income' as const,
      transaction_at: '2024-09-01T10:00:00Z',
      necessity_rating: 1,
      category: {
        id: 'cat1',
        name: 'Salary',
        icon: '💼'
      },
      account: {
        id: 'acc1',
        name: 'Checking Account',
        type: 'bank'
      },
      tags: [
        { id: 'tag1', name: 'Regular', color: '#10b981' }
      ],
      balance_after: 8450.25
    },
    {
      id: '2',
      description: 'Grocery Shopping - Whole Foods',
      amount: 87.50,
      converted_amount: 87.50,
      currency_code: 'USD',
      flow_type: 'expense' as const,
      transaction_at: '2024-09-01T14:30:00Z',
      necessity_rating: 2,
      category: {
        id: 'cat2',
        name: 'Food & Dining',
        icon: '🍽️'
      },
      account: {
        id: 'acc1',
        name: 'Checking Account',
        type: 'bank'
      },
      tags: [
        { id: 'tag2', name: 'Groceries', color: '#f59e0b' },
        { id: 'tag3', name: 'Weekly', color: '#8b5cf6' }
      ],
      files: [
        { id: 'file1', file_id: 'f1', filename: 'receipt.jpg' }
      ],
      balance_after: 8362.75
    },
    {
      id: '3',
      description: 'Coffee at Starbucks',
      amount: 5.75,
      converted_amount: 5.75,
      currency_code: 'USD',
      flow_type: 'expense' as const,
      transaction_at: '2024-08-31T08:15:00Z',
      necessity_rating: 4,
      category: {
        id: 'cat2',
        name: 'Food & Dining',
        icon: '☕'
      },
      account: {
        id: 'acc2',
        name: 'Credit Card',
        type: 'credit'
      },
      tags: [
        { id: 'tag4', name: 'Coffee', color: '#8b4513' }
      ],
      balance_after: 8357.00
    },
    {
      id: '4',
      description: 'Gas Station Fill-up',
      amount: 42.00,
      converted_amount: 42.00,
      currency_code: 'USD',
      flow_type: 'expense' as const,
      transaction_at: '2024-08-31T18:45:00Z',
      necessity_rating: 2,
      category: {
        id: 'cat3',
        name: 'Transportation',
        icon: '⛽'
      },
      account: {
        id: 'acc1',
        name: 'Checking Account',
        type: 'bank'
      },
      tags: [
        { id: 'tag5', name: 'Fuel', color: '#ef4444' }
      ],
      balance_after: 8315.00
    },
    {
      id: '5',
      description: 'Online Shopping - Amazon',
      amount: 125.99,
      converted_amount: 125.99,
      currency_code: 'USD',
      flow_type: 'expense' as const,
      transaction_at: '2024-08-30T16:20:00Z',
      necessity_rating: 3,
      category: {
        id: 'cat4',
        name: 'Shopping',
        icon: '🛒'
      },
      account: {
        id: 'acc2',
        name: 'Credit Card',
        type: 'credit'
      },
      tags: [
        { id: 'tag6', name: 'Online', color: '#3b82f6' },
        { id: 'tag7', name: 'Electronics', color: '#6366f1' }
      ],
      files: [
        { id: 'file2', file_id: 'f2', filename: 'invoice.pdf' },
        { id: 'file3', file_id: 'f3', filename: 'warranty.pdf' }
      ],
      balance_after: 8189.01
    }
  ]

  // Filter and sort transactions
  const filteredTransactions = mockTransactions
    .filter((transaction) => {
      // Search filter
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.account?.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Type filter
      const matchesType = filterType === 'all' || transaction.flow_type === filterType
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || transaction.category?.name === filterCategory
      
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.transaction_at).getTime()
        const dateB = new Date(b.transaction_at).getTime()
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
      } else {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount
      }
    })

  const uniqueCategories = Array.from(
    new Set(mockTransactions.map(t => t.category?.name).filter(Boolean))
  )

  const handleEdit = (id: string) => {
    console.log('Edit transaction:', id)
    // TODO: Implement edit functionality
  }

  const handleDelete = (id: string) => {
    console.log('Delete transaction:', id)
    // TODO: Implement delete functionality
  }

  const totalIncome = mockTransactions
    .filter(t => t.flow_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = mockTransactions
    .filter(t => t.flow_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

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
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-error'}`}>
                ${(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${totalIncome - totalExpenses >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
              <svg className={`w-6 h-6 ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-error'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="bg-base-200">
                  <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
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
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
            >
              <option value="date">Sort by Date</option>
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
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={handleDelete}
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