'use client'

import { useState } from 'react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - will be replaced with real API calls
  const mockData = {
    totalAssets: 15750.50,
    monthlyIncome: 5200.00,
    monthlyExpenses: 3420.75,
    accountBalances: [
      { name: 'Checking Account', balance: 8450.25, type: 'bank' },
      { name: 'Savings Account', balance: 6200.00, type: 'bank' },
      { name: 'Cash', balance: 1100.25, type: 'cash' }
    ],
    recentTransactions: [
      { id: 1, description: 'Grocery Shopping', amount: -87.50, category: 'Food', date: '2024-09-01', type: 'expense' },
      { id: 2, description: 'Salary Deposit', amount: 5200.00, category: 'Salary', date: '2024-09-01', type: 'income' },
      { id: 3, description: 'Coffee Shop', amount: -5.75, category: 'Food', date: '2024-08-31', type: 'expense' },
      { id: 4, description: 'Gas Station', amount: -42.00, category: 'Transport', date: '2024-08-31', type: 'expense' },
      { id: 5, description: 'Online Purchase', amount: -125.99, category: 'Shopping', date: '2024-08-30', type: 'expense' }
    ],
    categorySpending: [
      { category: 'Food', amount: 850.25, percentage: 35 },
      { category: 'Transport', amount: 420.50, percentage: 17 },
      { category: 'Shopping', amount: 380.75, percentage: 16 },
      { category: 'Entertainment', amount: 290.00, percentage: 12 },
      { category: 'Utilities', amount: 250.00, percentage: 10 },
      { category: 'Other', amount: 229.25, percentage: 10 }
    ]
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-2">Welcome back!</h2>
        <p className="text-base-content/70">Here's your financial overview for today.</p>
      </div>

      {/* Asset Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Total Assets</p>
              <p className="text-2xl font-bold text-base-content">${mockData.totalAssets.toLocaleString()}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Monthly Income</p>
              <p className="text-2xl font-bold text-success">${mockData.monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Monthly Expenses</p>
              <p className="text-2xl font-bold text-error">${mockData.monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-error/10 p-3 rounded-full">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Balances */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-base-content mb-6">Account Balances</h3>
            <div className="space-y-4">
              {mockData.accountBalances.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      account.type === 'bank' ? 'bg-primary/10' : 'bg-secondary/10'
                    }`}>
                      <svg className={`w-5 h-5 ${
                        account.type === 'bank' ? 'text-primary' : 'text-secondary'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {account.type === 'bank' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21l-1 6H4l-1-6h7.5z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-base-content">{account.name}</p>
                      <p className="text-sm text-base-content/70 capitalize">{account.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-base-content">${account.balance.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Spending */}
        <div>
          <div className="bg-base-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-base-content mb-6">Category Spending</h3>
            <div className="space-y-4">
              {mockData.categorySpending.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-base-content">{category.category}</span>
                    <span className="text-sm text-base-content/70">${category.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-base-content">Recent Transactions</h3>
            <a href="/dashboard/transactions" className="btn btn-outline btn-primary btn-sm">View All</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="font-medium text-base-content">{transaction.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-outline">{transaction.category}</span>
                    </td>
                    <td className="text-base-content/70">{transaction.date}</td>
                    <td className="text-right">
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-success' : 'text-error'
                      }`}>
                        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}