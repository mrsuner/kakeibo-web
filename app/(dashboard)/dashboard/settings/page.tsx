'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AccountsTab from './components/AccountsTab'
import CategoriesTabWithAPI from './components/CategoriesTabWithAPI'
import NotificationsTab from './components/NotificationsTab'
import PrivacyTab from './components/PrivacyTab'

interface Account {
  id: number
  name: string
  type: string
  balance: number
  isActive: boolean
  description?: string
  creditLimit?: number
  billingCycleDay?: number
  paymentDueDay?: number
}

interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
  color: string
  isActive: boolean
  icon?: string
  budget?: number
  budgetPeriod?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('accounts')
  const [message, setMessage] = useState('')

  // Mock data with extended Account interface
  const [accounts, setAccounts] = useState<Account[]>([
    { 
      id: 1, 
      name: 'Checking Account', 
      type: 'bank', 
      balance: 8450.25, 
      isActive: true,
      description: 'Primary checking account for daily expenses'
    },
    { 
      id: 2, 
      name: 'Savings Account', 
      type: 'bank', 
      balance: 6200.00, 
      isActive: true,
      description: 'Emergency fund and long-term savings'
    },
    { 
      id: 3, 
      name: 'Cash', 
      type: 'cash', 
      balance: 1100.25, 
      isActive: true 
    },
    { 
      id: 4, 
      name: 'Old Credit Card', 
      type: 'credit-card', 
      balance: -250.00, 
      isActive: false,
      creditLimit: 2000.00,
      billingCycleDay: 15,
      paymentDueDay: 5
    }
  ])

  // Mock data with extended Category interface
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Food', type: 'expense', color: '#ea580c', isActive: true, icon: '🍔', budget: 500, budgetPeriod: 'monthly' },
    { id: 2, name: 'Transport', type: 'expense', color: '#2563eb', isActive: true, icon: '🚗', budget: 200, budgetPeriod: 'monthly' },
    { id: 3, name: 'Shopping', type: 'expense', color: '#7c3aed', isActive: true, icon: '🛒' },
    { id: 4, name: 'Salary', type: 'income', color: '#16a34a', isActive: true, icon: '💼', budget: 5000, budgetPeriod: 'monthly' },
    { id: 5, name: 'Freelance', type: 'income', color: '#0891b2', isActive: true, icon: '💰' }
  ])

  const [notifications, setNotifications] = useState({
    emailTransactions: true,
    emailBudgetAlerts: true,
    emailMonthlyReport: false,
    pushTransactions: false,
    pushBudgetAlerts: true
  })

  const [privacy, setPrivacy] = useState({
    dataExport: false,
    shareUsageData: true,
    marketingEmails: false
  })

  const handleAccountToggle = (accountId: number) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, isActive: !account.isActive }
        : account
    ))
    setMessage('Account status updated')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAccountUpdate = (updatedAccount: Account) => {
    setAccounts(prev => prev.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    ))
    setMessage('Account updated successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAccountAdd = (newAccount: Omit<Account, 'id'>) => {
    const id = Math.max(...accounts.map(a => a.id)) + 1
    setAccounts(prev => [...prev, { ...newAccount, id }])
    setMessage('Account added successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCategoryToggle = (categoryId: number) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ))
    setMessage('Category status updated')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCategoryUpdate = (updatedCategory: Category) => {
    setCategories(prev => prev.map(category => 
      category.id === updatedCategory.id ? updatedCategory : category
    ))
    setMessage('Category updated successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCategoryAdd = (newCategory: Omit<Category, 'id'>) => {
    const id = Math.max(...categories.map(c => c.id)) + 1
    setCategories(prev => [...prev, { ...newCategory, id }])
    setMessage('Category added successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    setMessage('Notification preferences updated')
    setTimeout(() => setMessage(''), 3000)
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
    setMessage('Privacy settings updated')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleExportData = async () => {
    setMessage('Preparing data export...')
    // TODO: Implement data export
    await new Promise(resolve => setTimeout(resolve, 2000))
    setMessage('Data export sent to your email')
    setTimeout(() => setMessage(''), 5000)
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.'
    )
    
    if (confirmed) {
      setMessage('Account deletion initiated...')
      // TODO: Implement account deletion
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/')
    }
  }

  const tabs = [
    { id: 'accounts', name: 'Accounts', icon: '🏦' },
    { id: 'categories', name: 'Categories', icon: '🏷️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy & Security', icon: '🔒' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost btn-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Settings</h1>
            <p className="text-base-content/70 mt-1">Manage your accounts, categories, and preferences</p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="alert alert-success mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 rounded-xl shadow-lg p-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary text-primary-content' 
                      : 'hover:bg-base-200'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-base-100 rounded-xl shadow-lg p-8">
            
            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
              <AccountsTab />
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <CategoriesTabWithAPI />
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <NotificationsTab
                notifications={notifications}
                onNotificationChange={handleNotificationChange}
              />
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <PrivacyTab
                privacy={privacy}
                onPrivacyChange={handlePrivacyChange}
                onExportData={handleExportData}
                onDeleteAccount={handleDeleteAccount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}