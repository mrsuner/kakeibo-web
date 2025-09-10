'use client'

import type { CategoryFilters } from '../domain/categories.types'

interface CategoriesFiltersProps {
  filters: CategoryFilters
  onFiltersChange: (filters: Partial<CategoryFilters>) => void
}

export function CategoriesFilters({ filters, onFiltersChange }: CategoriesFiltersProps) {
  return (
    <div className="bg-base-100 rounded-xl p-6 shadow-sm mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <div className="input-group w-full">
            <input
              type="text"
              placeholder="Search categories..."
              className="input input-bordered flex-1"
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
            />
            <span className="bg-base-200">
              <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <select
            className="select select-bordered w-full"
            value={filters.typeFilter}
            onChange={(e) => onFiltersChange({ typeFilter: e.target.value as 'all' | 'income' | 'expense' })}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        <div>
          <select
            className="select select-bordered w-full"
            value={filters.statusFilter}
            onChange={(e) => onFiltersChange({ statusFilter: e.target.value as 'all' | 'active' | 'inactive' })}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select
            className="select select-bordered flex-1"
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as 'name' | 'hits' })}
          >
            <option value="name">Sort by Name</option>
            <option value="hits">Sort by Usage</option>
          </select>
          <button
            className="btn btn-square btn-outline"
            onClick={() => onFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {filters.sortOrder === 'desc' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}