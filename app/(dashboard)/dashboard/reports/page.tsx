'use client'

import { useState, useMemo } from 'react'
import { useGetDashboardReportQuery, useGetSpendingTrendsQuery } from '@/lib/store/features/reportApi'
import type { ReportFilters } from '@/lib/store/features/reportApi'
import { IncomeExpenseTrendChart } from '@/components/ui/charts/income-expense-trend-chart'
import { CategoryPieChart } from '@/components/ui/charts/category-pie-chart'

export default function ReportsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<ReportFilters['time_range']>('this_month')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const timeRangeOptions = [
    { value: 'this_week' as const, label: 'This Week' },
    { value: 'this_month' as const, label: 'This Month' },
    { value: 'last_month' as const, label: 'Last Month' },
    { value: 'this_quarter' as const, label: 'This Quarter' },
    { value: 'this_year' as const, label: 'This Year' },
    { value: 'custom' as const, label: 'Custom Range' },
  ]

  // Prepare filters for API call
  const reportFilters = useMemo((): ReportFilters => {
    const filters: ReportFilters = { time_range: selectedTimeRange }
    
    if (selectedTimeRange === 'custom') {
      filters.start_date = customStartDate
      filters.end_date = customEndDate
    }
    
    return filters
  }, [selectedTimeRange, customStartDate, customEndDate])

  // Fetch dashboard report from API
  const { 
    data: reportData, 
    error, 
    isLoading, 
    refetch 
  } = useGetDashboardReportQuery(reportFilters, {
    skip: selectedTimeRange === 'custom' && (!customStartDate || !customEndDate)
  })

  // Fetch spending trends for chart
  const { 
    data: trendsData,
    isLoading: trendsLoading 
  } = useGetSpendingTrendsQuery(reportFilters, {
    skip: selectedTimeRange === 'custom' && (!customStartDate || !customEndDate)
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Financial Reports
          </h1>
          <p className="text-base-content/60">
            Analyze your spending patterns and financial insights
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Financial Reports
          </h1>
        </div>
        <div className="alert alert-error">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load report data. Please try again.</span>
          <button className="btn btn-sm btn-ghost ml-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Extract data from API response
  const totalSpendingData = reportData?.total_spending.current || {
    income: { amount: 0, count: 0, change_percentage: 0 },
    expense: { amount: 0, count: 0, change_percentage: 0 },
    outstanding: { amount: 0, count: 0 },
    net: { amount: 0 }
  }

  const categoriesData = reportData?.categories_spending.categories || []

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Financial Reports
        </h1>
        <p className="text-base-content/60">
          Analyze your spending patterns and financial insights
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="bg-base-100 rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-base-content mb-4">
          Select Time Period
        </h2>
        
        <div className="flex flex-wrap gap-3 mb-4">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeRange(option.value)}
              className={`btn btn-sm ${
                selectedTimeRange === option.value 
                  ? 'btn-primary' 
                  : 'btn-ghost'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {selectedTimeRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Total Spending Report */}
      <div className="bg-base-100 rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-base-content">
            Financial Overview
          </h2>
          <div className="text-sm text-base-content/60">
            {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Income Card */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="stat-title">Total Income</div>
              <div className="stat-value text-success">
                ${totalSpendingData.income.amount.toLocaleString()}
              </div>
              <div className="stat-desc">
                {totalSpendingData.income.change_percentage > 0 ? '↗︎' : totalSpendingData.income.change_percentage < 0 ? '↘︎' : '→'} 
                {Math.abs(totalSpendingData.income.change_percentage)}% from last period
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-error">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="stat-title">Total Expenses</div>
              <div className="stat-value text-error">
                ${totalSpendingData.expense.amount.toLocaleString()}
              </div>
              <div className="stat-desc">
                {totalSpendingData.expense.change_percentage > 0 ? '↗︎' : totalSpendingData.expense.change_percentage < 0 ? '↘︎' : '→'} 
                {Math.abs(totalSpendingData.expense.change_percentage)}% from last period
              </div>
            </div>
          </div>

          {/* Outstanding Card */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title">Outstanding</div>
              <div className="stat-value text-warning">
                ${totalSpendingData.outstanding.amount.toLocaleString()}
              </div>
              <div className="stat-desc">Pending transactions</div>
            </div>
          </div>

          {/* Net Income Card */}
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="stat-title">Net Income</div>
              <div className="stat-value text-info">
                ${totalSpendingData.net.amount.toLocaleString()}
              </div>
              <div className="stat-desc">Income - Expenses</div>
            </div>
          </div>
        </div>

        {/* Income vs Expenses Trend Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-base-content mb-4">
            Income vs Expenses Trend
          </h3>
          <IncomeExpenseTrendChart 
            data={trendsData?.trends || []} 
            isLoading={trendsLoading}
          />
        </div>
      </div>

      {/* Category Spending Report */}
      <div className="bg-base-100 rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-base-content">
            Spending by Categories
          </h2>
          <button className="btn btn-sm btn-ghost">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category List */}
          <div className="space-y-4">
            {categoriesData.length > 0 ? (
              categoriesData.map((category, index) => (
                <div key={category.category_id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.category_color }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-base-content">{category.category_name}</h4>
                      <p className="text-sm text-base-content/60">{category.percentage_of_total}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-base-content">${category.current_amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-base-content/60">No category data available for this period</p>
              </div>
            )}
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="flex flex-col">
            <h3 className="text-lg font-medium text-base-content mb-4">
              Category Distribution
            </h3>
            <CategoryPieChart 
              data={categoriesData} 
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Category Trends */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-base-content mb-4">
            Category Spending Trends
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Current Period</th>
                  <th>Previous Period</th>
                  <th>Change</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.length > 0 ? (
                  categoriesData.map((category, index) => (
                    <tr key={category.category_id}>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.category_color }}
                          ></div>
                          <span>{category.category_name}</span>
                        </div>
                      </td>
                      <td className="font-medium">${category.current_amount.toLocaleString()}</td>
                      <td className="text-base-content/60">${category.previous_amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${
                          category.change_percentage > 0 ? 'badge-error' : 
                          category.change_percentage < 0 ? 'badge-success' : 
                          'badge-neutral'
                        }`}>
                          {category.change_percentage > 0 ? '+' : ''}{category.change_percentage}%
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center">
                          {category.trend === 'up' && (
                            <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          )}
                          {category.trend === 'down' && (
                            <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          )}
                          {category.trend === 'stable' && (
                            <svg className="w-4 h-4 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <span className="text-base-content/60">No category trends available for this period</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button className="btn btn-ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m4 4v12" />
          </svg>
          Export to PDF
        </button>
        <button className="btn btn-ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </button>
      </div>
    </div>
  )
}