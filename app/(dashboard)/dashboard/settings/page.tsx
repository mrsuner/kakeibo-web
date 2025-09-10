'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NotificationsTab from './components/NotificationsTab'
import PrivacyTab from './components/PrivacyTab'


export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('notifications')
  const [message, setMessage] = useState('')

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

  useEffect(() => {
    const tab = searchParams.get('tab')
    const validTabs = ['notifications', 'privacy']
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tabId)
    router.push(url.pathname + url.search, { scroll: false })
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
            <p className="text-base-content/70 mt-1">Manage your notifications and privacy preferences</p>
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
                  onClick={() => handleTabChange(tab.id)}
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