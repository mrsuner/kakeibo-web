export const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'cash': return '💵'
    case 'savings_account':
    case 'savings': return '🏦'
    case 'debit_card':
    case 'debit-card': return '💳'
    case 'credit_card':
    case 'credit-card': return '💳'
    case 'checking': return '🏦'
    case 'e_wallet': return '📱'
    default: return '💰'
  }
}