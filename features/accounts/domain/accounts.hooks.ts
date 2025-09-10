'use client'

import { useState, useEffect } from 'react'

export function useAccountsViewPreference() {
  const [showCurrencyDetails, setShowCurrencyDetails] = useState(false)

  // Persist user preference for balance view
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accounts.showCurrencyDetails')
      if (saved != null) setShowCurrencyDetails(saved === 'true')
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('accounts.showCurrencyDetails', String(showCurrencyDetails))
    } catch {
      // Ignore localStorage errors
    }
  }, [showCurrencyDetails])

  return [showCurrencyDetails, setShowCurrencyDetails] as const
}