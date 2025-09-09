'use client'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import type { CategorySpendingItem } from '@/lib/store/features/reportApi'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

interface CategoryPieChartProps {
  data: CategorySpendingItem[]
  isLoading?: boolean
}

export function CategoryPieChart({ data, isLoading }: CategoryPieChartProps) {
  if (isLoading) {
    return (
      <div className="bg-base-200 rounded-lg h-80 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-base-200 rounded-lg h-80 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-base-content/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className="text-base-content/60">No category data available</p>
        </div>
      </div>
    )
  }

  // Filter out categories with zero spending and sort by amount
  const filteredData = data.filter(item => item.current_amount > 0).slice(0, 10) // Top 10 categories

  // Generate colors for categories (use category colors if available, otherwise generate colors)
  const colors = filteredData.map((item) => {
    // Use the category color from the API if available
    if (item.category_color && item.category_color !== '#000000') {
      return item.category_color
    }
    // Otherwise generate colors
    const hue = (filteredData.indexOf(item) * 137.5) % 360 // Golden angle approximation for even distribution
    return `hsl(${hue}, 65%, 55%)`
  })

  const chartData = {
    labels: filteredData.map(item => item.category_name),
    datasets: [
      {
        data: filteredData.map(item => item.current_amount),
        backgroundColor: colors,
        borderColor: colors.map(color => color), // Same as background
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      },
    ],
  }

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: function(chart) {
            const data = chart.data
            if (data.labels && data.datasets.length) {
              const dataset = data.datasets[0]
              return data.labels.map((label, index) => {
                const value = dataset.data[index] as number
                const percentage = filteredData[index]?.percentage_of_total || 0
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor?.[index] as string,
                  strokeStyle: dataset.borderColor?.[index] as string,
                  lineWidth: dataset.borderWidth as number,
                  hidden: false,
                  index: index,
                }
              })
            }
            return []
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed as number
            const percentage = filteredData[context.dataIndex]?.percentage_of_total || 0
            return `${label}: $${value.toLocaleString()} (${percentage}%)`
          }
        }
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
  }

  return (
    <div className="bg-base-100 rounded-lg p-4" style={{ height: '320px' }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}