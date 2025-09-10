'use client'

import { useState } from 'react'
import { Transaction, useDeleteTransactionMutation } from '@/lib/store/features/transactionApi'
import { useTransactionFilters, useTransactionsList } from '@/components/domain/transaction/use-transaction-filters'
import { TransactionPageHeader } from '@/components/ui/transaction-page-header'
import { TransactionSummaryCards } from '@/components/ui/transaction-summary-cards'
import { TransactionFilters } from '@/components/ui/transaction-filters'
import { TransactionList } from '@/components/ui/transaction-list'
import { TransactionPagination } from '@/components/ui/transaction-pagination'
import TransactionDetailsModal from '@/components/domain/transaction/transaction-details-modal'
import TransactionEditModal from '@/components/domain/transaction/transaction-edit-modal'
import ConfirmDeleteModal from '@/components/ui/confirm-delete-modal'

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false)

  const [deleteTransactionMutation] = useDeleteTransactionMutation()
  const { filters, actions } = useTransactionFilters()
  const {
    transactions,
    summary,
    pagination,
    uniqueCategories,
    isLoading,
    error,
    isSearchPending,
  } = useTransactionsList(filters)

  const handleEdit = (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      setEditTransaction(transaction)
      setIsEditModalOpen(true)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteTransactionId(id)
    setIsDeleteModalOpen(true)
  }

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditTransaction(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeleteTransactionId(null)
  }

  const handleEditSuccess = () => {
    handleCloseEditModal()
  }

  const handleConfirmDelete = async () => {
    if (!deleteTransactionId) return
    
    setIsDeletingTransaction(true)
    try {
      await deleteTransactionMutation(deleteTransactionId).unwrap()
      handleCloseDeleteModal()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    } finally {
      setIsDeletingTransaction(false)
    }
  }

  // Use summary from API if available, otherwise default to 0
  const totalIncome = summary?.total_income || 0
  const totalExpenses = summary?.total_expenses || 0
  const netAmount = summary?.net_amount || (totalIncome - totalExpenses)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <TransactionPageHeader />

      <TransactionSummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netAmount={netAmount}
      />

      <TransactionFilters
        searchTerm={filters.searchTerm}
        onSearchChange={actions.setSearchTerm}
        filterType={filters.filterType}
        onFilterTypeChange={actions.setFilterType}
        filterCategory={filters.filterCategory}
        onFilterCategoryChange={actions.setFilterCategory}
        sortBy={filters.sortBy}
        onSortByChange={actions.setSortBy}
        sortOrder={filters.sortOrder}
        onToggleSortOrder={actions.toggleSortOrder}
        uniqueCategories={uniqueCategories}
        isSearchPending={isSearchPending}
      />

      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        error={error}
        searchTerm={filters.searchTerm}
        filterType={filters.filterType}
        filterCategory={filters.filterCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTransactionClick={handleTransactionClick}
      />

      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />

      <TransactionEditModal
        transaction={editTransaction}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        isLoading={isDeletingTransaction}
      />

      <TransactionPagination hasTransactions={transactions.length > 0} />
    </div>
  )
}