'use client'

interface TransactionTag {
  id: string
  name: string
  color?: string
}

interface TransactionFile {
  id: string
  file_id: string
  filename?: string
}

interface TransactionCardProps {
  transaction: {
    id: string
    description: string
    amount: number
    converted_amount?: number
    currency_code: string
    flow_type: 'income' | 'expense'
    transaction_at: string
    necessity_rating?: number
    category?: {
      id: string
      name: string
      icon?: string
    }
    account?: {
      id: string
      name: string
      type: string
    }
    tags?: TransactionTag[]
    files?: TransactionFile[]
    balance_after?: number
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: () => void
}

export default function TransactionCard({ transaction, onEdit, onDelete, onClick }: TransactionCardProps) {
  const formatAmount = (amount: number, flowType: string) => {
    const sign = flowType === 'income' ? '+' : '-'
    return `${sign}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getNecessityRatingColor = (rating?: number) => {
    if (!rating) return 'text-base-content/60'
    if (rating <= 2) return 'text-success'
    if (rating <= 3) return 'text-warning'
    return 'text-error'
  }

  const getNecessityRatingText = (rating?: number) => {
    if (!rating) return 'Not rated'
    const ratings = ['', 'Essential', 'Important', 'Moderate', 'Low', 'Luxury']
    return ratings[rating] || 'Unknown'
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('[role="button"]')) {
      return
    }
    onClick?.()
  }

  return (
    <div 
      className={`bg-base-100 rounded-xl p-4 sm:p-6 shadow-sm border border-base-200 hover:shadow-md transition-all hover:border-primary/20 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-full flex-shrink-0 ${
            transaction.flow_type === 'income' ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <span className="text-lg sm:text-xl">
              {transaction.category?.icon || (transaction.flow_type === 'income' ? '💵' : '💸')}
            </span>
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base-content line-clamp-2 break-words">
              {transaction.description}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <span className="text-xs sm:text-sm text-base-content/60 whitespace-nowrap">
                {formatDate(transaction.transaction_at)} • {formatTime(transaction.transaction_at)}
              </span>
              {transaction.account && (
                <>
                  <span className="text-base-content/40 hidden sm:inline">•</span>
                  <span className="text-xs sm:text-sm text-base-content/60">
                    {transaction.account.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <div className={`text-base sm:text-lg font-bold ${
            transaction.flow_type === 'income' ? 'text-success' : 'text-error'
          }`}>
            {formatAmount(transaction.amount, transaction.flow_type)}
          </div>
          <div className="text-xs text-base-content/60">
            {transaction.currency_code}
          </div>
          {transaction.balance_after !== null && transaction.balance_after !== undefined && (
            <div className="text-xs text-base-content/50 mt-1">
              Balance: ${transaction.balance_after.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          )}
        </div>
      </div>

      {/* Category and Tags Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {transaction.category && (
            <span className="badge badge-outline badge-sm">
              {transaction.category.name}
            </span>
          )}
          {transaction.necessity_rating && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-base-content/60">Need:</span>
              <span className={`text-xs font-medium ${getNecessityRatingColor(transaction.necessity_rating)}`}>
                {getNecessityRatingText(transaction.necessity_rating)}
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction.id)}
              className="btn btn-ghost btn-xs sm:btn-sm text-base-content/60 hover:text-primary p-1 sm:p-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="btn btn-ghost btn-xs sm:btn-sm text-base-content/60 hover:text-error p-1 sm:p-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tags Row */}
      {transaction.tags && transaction.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {transaction.tags.map((tag) => (
            <span
              key={tag.id}
              className="badge badge-ghost badge-xs"
              style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Files Row */}
      {transaction.files && transaction.files.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-base-200">
          <svg className="w-4 h-4 text-base-content/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="text-xs text-base-content/60">
            {transaction.files.length} attachment{transaction.files.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}