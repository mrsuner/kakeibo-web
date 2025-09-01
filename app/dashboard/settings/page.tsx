'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('accounts')
  const [message, setMessage] = useState('')

  // Mock data
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking Account', type: 'bank', balance: 8450.25, isActive: true },
    { id: 2, name: 'Savings Account', type: 'bank', balance: 6200.00, isActive: true },
    { id: 3, name: 'Cash', type: 'cash', balance: 1100.25, isActive: true },
    { id: 4, name: 'Old Credit Card', type: 'credit', balance: 0, isActive: false }
  ])

  const [categories, setCategories] = useState([
    { id: 1, name: 'Food', type: 'expense', color: '#ea580c', isActive: true },
    { id: 2, name: 'Transport', type: 'expense', color: '#2563eb', isActive: true },
    { id: 3, name: 'Shopping', type: 'expense', color: '#7c3aed', isActive: true },
    { id: 4, name: 'Salary', type: 'income', color: '#16a34a', isActive: true },
    { id: 5, name: 'Freelance', type: 'income', color: '#0891b2', isActive: true }
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

  const handleCategoryToggle = (categoryId: number) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ))
    setMessage('Category status updated')
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

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank': return '🏦'
      case 'cash': return '💵'
      case 'credit': return '💳'
      default: return '💰'
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn btn-ghost btn-sm"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-primary">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
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
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-base-content">Account Management</h2>
                      <p className="text-base-content/70 mt-1">Manage your financial accounts and their visibility</p>
                    </div>
                    <button className="btn btn-primary btn-sm">+ Add Account</button>
                  </div>

                  <div className="space-y-4">
                    {accounts.map(account => (
                      <div key={account.id} className="border border-base-300 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl">{getAccountTypeIcon(account.type)}</span>
                            <div>
                              <h3 className="font-semibold text-base-content">{account.name}</h3>
                              <p className="text-sm text-base-content/70 capitalize">{account.type} account</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-base-content">
                                ${account.balance.toLocaleString()}
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary" 
                              checked={account.isActive}
                              onChange={() => handleAccountToggle(account.id)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-base-content">Category Management</h2>
                      <p className="text-base-content/70 mt-1">Organize your income and expense categories</p>
                    </div>
                    <button className="btn btn-primary btn-sm">+ Add Category</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-error mb-4">Expense Categories</h3>
                      <div className="space-y-3">
                        {categories.filter(c => c.type === 'expense').map(category => (
                          <div key={category.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary toggle-sm" 
                              checked={category.isActive}
                              onChange={() => handleCategoryToggle(category.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-success mb-4">Income Categories</h3>
                      <div className="space-y-3">
                        {categories.filter(c => c.type === 'income').map(category => (
                          <div key={category.id} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <input 
                              type="checkbox" 
                              className="toggle toggle-primary toggle-sm" 
                              checked={category.isActive}
                              onChange={() => handleCategoryToggle(category.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-2">Notification Preferences</h2>
                  <p className="text-base-content/70 mb-6">Choose how you want to be notified about your financial activity</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-base-content mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Transaction Notifications</div>
                            <div className="text-sm text-base-content/70">Get notified when transactions are added</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifications.emailTransactions}
                            onChange={(e) => handleNotificationChange('emailTransactions', e.target.checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Budget Alerts</div>
                            <div className="text-sm text-base-content/70">Alerts when you approach budget limits</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifications.emailBudgetAlerts}
                            onChange={(e) => handleNotificationChange('emailBudgetAlerts', e.target.checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Monthly Reports</div>
                            <div className="text-sm text-base-content/70">Monthly spending summary and insights</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifications.emailMonthlyReport}
                            onChange={(e) => handleNotificationChange('emailMonthlyReport', e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-base-content mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Transaction Notifications</div>
                            <div className="text-sm text-base-content/70">Push notifications for new transactions</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifications.pushTransactions}
                            onChange={(e) => handleNotificationChange('pushTransactions', e.target.checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Budget Alerts</div>
                            <div className="text-sm text-base-content/70">Push alerts for budget thresholds</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={notifications.pushBudgetAlerts}
                            onChange={(e) => handleNotificationChange('pushBudgetAlerts', e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Security Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-base-content mb-2">Privacy & Security</h2>
                  <p className="text-base-content/70 mb-6">Manage your data privacy and account security</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-base-content mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Export My Data</div>
                            <div className="text-sm text-base-content/70">Download all your transaction data</div>
                          </div>
                          <button onClick={handleExportData} className="btn btn-outline btn-primary btn-sm">
                            Export
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Share Usage Data</div>
                            <div className="text-sm text-base-content/70">Help improve our app with anonymous usage data</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={privacy.shareUsageData}
                            onChange={(e) => handlePrivacyChange('shareUsageData', e.target.checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
                          <div>
                            <div className="font-medium">Marketing Emails</div>
                            <div className="text-sm text-base-content/70">Receive updates about new features and tips</div>
                          </div>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={privacy.marketingEmails}
                            onChange={(e) => handlePrivacyChange('marketingEmails', e.target.checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                      <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
                      <div className="border-2 border-error/20 rounded-lg p-6 bg-error/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-error">Delete Account</div>
                            <div className="text-sm text-base-content/70">
                              Permanently delete your account and all associated data
                            </div>
                          </div>
                          <button 
                            onClick={handleDeleteAccount}
                            className="btn btn-error btn-outline btn-sm"
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}