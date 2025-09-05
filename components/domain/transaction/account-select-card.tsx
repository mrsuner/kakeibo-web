'use client'

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { openAccountModal, clearSelectedAccount } from '@/lib/store/features/transactionFormSlice'

export default function AccountSelectCard() {
  const dispatch = useAppDispatch()
  const { selectedAccount } = useAppSelector((state) => state.transactionForm)

  const handleOpenModal = () => {
    dispatch(openAccountModal())
  }

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(clearSelectedAccount())
  }

  const getAccountIcon = (accountType?: string) => {
    switch (accountType) {
      case 'checking':
        return '💳'
      case 'savings':
        return '🏦'
      case 'credit':
        return '💰'
      case 'investment':
        return '📈'
      case 'cash':
        return '💵'
      default:
        return '💼'
    }
  }

  return (
    <div className="form-control">
      <div
        className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md hover:scale-[1.02] text-left cursor-pointer ${
          selectedAccount
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-base-200 hover:border-primary/50 bg-base-100'
        }`}
        onClick={handleOpenModal}
      >
        {selectedAccount && (
          <div className="absolute top-2 right-2">
            <div
              onClick={handleClearSelection}
              className="btn btn-ghost btn-circle btn-xs hover:btn-error"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <span className="text-3xl">
            {getAccountIcon(selectedAccount?.type)}
          </span>
          <div className="flex-1 min-w-0">
            {selectedAccount ? (
              <>
                <p className={`font-semibold text-base truncate ${
                  selectedAccount ? 'text-primary' : 'text-base-content'
                }`}>
                  {selectedAccount.name}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {selectedAccount.type} • Balance: ${selectedAccount.balance?.toFixed(2) || '0.00'}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-base text-base-content/60">
                  Select an account
                </p>
                <p className="text-xs text-base-content/40">
                  Choose payment account
                </p>
              </>
            )}
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-base-content/60 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}