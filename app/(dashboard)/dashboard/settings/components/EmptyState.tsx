'use client'

interface EmptyStateProps {
  type: 'expense' | 'income'
  onAddCategory: () => void
}

export default function EmptyState({ type, onAddCategory }: EmptyStateProps) {
  const config = {
    expense: {
      emoji: '📝',
      title: 'No expense categories yet',
      buttonText: 'Add your first expense category'
    },
    income: {
      emoji: '💼',
      title: 'No income categories yet',
      buttonText: 'Add your first income category'
    }
  }

  const { emoji, title, buttonText } = config[type]

  return (
    <div className="text-center py-8 text-base-content/50">
      <div className="text-4xl mb-2">{emoji}</div>
      <p>{title}</p>
      <button 
        onClick={onAddCategory}
        className="btn btn-sm btn-outline btn-primary mt-2"
      >
        {buttonText}
      </button>
    </div>
  )
}