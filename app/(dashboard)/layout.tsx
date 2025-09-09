'use client'

import { useRouter } from 'next/navigation'
import { useState, useId } from 'react'
import { AuthWrapper } from '@/components/AuthWrapper'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const drawerId = useId()

  const handleSignOut = () => {
    logout()
  }

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/transactions', label: 'Transactions' },
    { href: '/dashboard/categories', label: 'Categories' },
    { href: '/dashboard/accounts', label: 'Accounts' },
    { href: '/dashboard/reports', label: 'Reports' },
  ]

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-base-200">
        {/* Mobile Drawer */}
        <div className="drawer md:hidden">
          <input 
            id={drawerId} 
            type="checkbox" 
            className="drawer-toggle" 
            checked={isMobileMenuOpen}
            onChange={(e) => setIsMobileMenuOpen(e.target.checked)}
          />
          
          {/* Mobile Page Content */}
          <div className="drawer-content">
            {/* Mobile Header */}
            <header className="bg-base-100 shadow-sm border-b sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Mobile Menu Button */}
                    <label 
                      htmlFor={drawerId}
                      className="btn btn-ghost btn-square drawer-button"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      <span className="sr-only">Open menu</span>
                    </label>
                    
                    <button 
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Kakeibo
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Mobile Add Transaction Button */}
                    <a href="/dashboard/add-transaction" className="btn btn-primary btn-sm">
                      +
                    </a>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Main Content */}
            <main>
              {children}
            </main>
          </div>

          {/* Mobile Drawer Sidebar */}
          <div className="drawer-side">
            <label htmlFor={drawerId} className="drawer-overlay"></label>
            <aside className="min-h-full w-80 bg-base-100 p-0">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-base-200">
                <button 
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Kakeibo
                </button>
                <label htmlFor={drawerId} className="btn btn-ghost btn-square btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="sr-only">Close menu</span>
                </label>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-base-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-base-content">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {user?.email && user?.name ? user.email : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <ul className="menu menu-lg w-full">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="text-base font-medium"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  
                  <div className="divider my-2"></div>
                  
                  <li>
                    <a
                      href="/dashboard/profile"
                      onClick={closeMobileMenu}
                      className="text-base font-medium"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/settings"
                      onClick={closeMobileMenu}
                      className="text-base font-medium"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-base font-medium text-error hover:text-error/80"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Desktop Header */}
          <header className="bg-base-100 shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Kakeibo
                  </button>
                  {/* Desktop Navigation */}
                  <nav className="flex items-center space-x-4">
                    {navigationItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Desktop Add Transaction Button */}
                  <a href="/dashboard/add-transaction" className="btn btn-primary btn-sm">
                    + Add Transaction
                  </a>

                  {/* User Avatar - Desktop */}
                  <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost btn-circle avatar" type="button">
                      <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </button>
                    <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                      <li><a href="/dashboard/profile">Profile</a></li>
                      <li><a href="/dashboard/settings">Settings</a></li>
                      <li><button type="button" onClick={handleSignOut}>Sign Out</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Desktop Main Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </AuthWrapper>
  )
}
