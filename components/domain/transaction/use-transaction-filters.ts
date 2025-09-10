'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGetTransactionsQuery, useDeleteTransactionMutation, Transaction } from '@/lib/store/features/transactionApi'

export interface TransactionFilters {
  searchTerm: string
  debouncedSearchTerm: string
  filterType: 'all' | 'income' | 'expense'
  filterCategory: string
  sortBy: 'transaction_at' | 'amount'
  sortOrder: 'asc' | 'desc'
  page: number
}

export interface TransactionFiltersActions {
  setSearchTerm: (term: string) => void
  setFilterType: (type: 'all' | 'income' | 'expense') => void
  setFilterCategory: (category: string) => void
  setSortBy: (sortBy: 'transaction_at' | 'amount') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setPage: (page: number) => void
  toggleSortOrder: () => void
}

export function useTransactionFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'transaction_at' | 'amount'>('transaction_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      // Reset to first page when search changes
      if (searchTerm !== debouncedSearchTerm) {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, debouncedSearchTerm])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filterType, filterCategory, sortBy, sortOrder])

  const toggleSortOrder = useCallback(() => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc')
  }, [])

  const filters: TransactionFilters = {
    searchTerm,
    debouncedSearchTerm,
    filterType,
    filterCategory,
    sortBy,
    sortOrder,
    page,
  }

  const actions: TransactionFiltersActions = {
    setSearchTerm,
    setFilterType,
    setFilterCategory,
    setSortBy,
    setSortOrder,
    setPage,
    toggleSortOrder,
  }

  return { filters, actions }
}

export function useTransactionsList(filters: TransactionFilters) {
  const { data: transactionsData, error, isLoading } = useGetTransactionsQuery({
    search: filters.debouncedSearchTerm || undefined,
    type: filters.filterType === 'all' ? undefined : filters.filterType,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
    page: filters.page,
    limit: 15,
  })

  const [deleteTransaction] = useDeleteTransactionMutation()

  const transactions = transactionsData?.transactions || []
  const summary = transactionsData?.summary
  const pagination = transactionsData?.pagination

  // Check if search is pending
  const isSearchPending = filters.searchTerm !== filters.debouncedSearchTerm

  // Filter transactions by category (client-side filtering)
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = filters.filterCategory === 'all' || transaction.category?.name === filters.filterCategory
    return matchesCategory
  })

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(
    new Set(transactions.map(t => t.category?.name).filter(Boolean))
  )

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id).unwrap()
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  return {
    transactions: filteredTransactions,
    summary,
    pagination,
    uniqueCategories,
    isLoading,
    error,
    isSearchPending,
    handleDelete,
  }
}