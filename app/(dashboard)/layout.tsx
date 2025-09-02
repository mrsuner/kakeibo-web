'use client'

import { useRouter } from 'next/navigation'
import { AuthWrapper } from '@/components/AuthWrapper'
import { useAuth } from '@/lib/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    logout()
  }

  return (
    <AuthWrapper requireAuth={true}>
      <div className="min-h-screen bg-base-200">
      {/* Dashboard Header */}
      <header className="bg-base-100 shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Kakeibo
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/dashboard/add-transaction" className="btn btn-primary btn-sm">
                + Add Transaction
              </a>
              <div className="dropdown dropdown-end">
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