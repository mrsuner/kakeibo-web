'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

  const handleSignOut = () => {
    logout()
  }

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/transactions', label: 'Transactions' },
    { href: '/dashboard/categories', label: 'Categories' },
    { href: '/dashboard/accounts', label: 'Accounts' },
  ]

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-base-200">
      {/* Dashboard Header */}
      <header className="bg-base-100 shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Kakeibo
              </button>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
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
              <a href="/dashboard/add-transaction" className="hidden sm:flex btn btn-primary btn-sm">
                + Add Transaction
              </a>
              
              {/* Mobile Add Transaction Button */}
              <a href="/dashboard/add-transaction" className="sm:hidden btn btn-primary btn-sm">
                +
              </a>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden btn btn-ghost btn-square"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>

              {/* User Avatar - Desktop */}
              <div className="hidden md:flex dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li><a href="/dashboard/profile">Profile</a></li>
                  <li><a href="/dashboard/settings">Settings</a></li>
                  <li><button onClick={handleSignOut}>Sign Out</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-base-200">
              <nav className="flex flex-col space-y-2 mt-4">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="text-base font-medium text-base-content/70 hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-base-200"
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile User Menu Items */}
                <hr className="my-2 border-base-200" />
                <div className="flex items-center space-x-3 py-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {user?.email && user?.name ? user.email : ''}
                    </p>
                  </div>
                </div>
                
                <a
                  href="/dashboard/profile"
                  onClick={closeMobileMenu}
                  className="text-base font-medium text-base-content/70 hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-base-200"
                >
                  Profile
                </a>
                <a
                  href="/dashboard/settings"
                  onClick={closeMobileMenu}
                  className="text-base font-medium text-base-content/70 hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-base-200"
                >
                  Settings
                </a>
                <button
                  onClick={handleSignOut}
                  className="text-base font-medium text-base-content/70 hover:text-error transition-colors py-2 px-2 rounded-lg hover:bg-base-200 text-left"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </AuthWrapper>
  )
}
