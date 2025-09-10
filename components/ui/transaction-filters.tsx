'use client'

interface TransactionFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filterType: 'all' | 'income' | 'expense'
  onFilterTypeChange: (type: 'all' | 'income' | 'expense') => void
  filterCategory: string
  onFilterCategoryChange: (category: string) => void
  sortBy: 'transaction_at' | 'amount'
  onSortByChange: (sortBy: 'transaction_at' | 'amount') => void
  sortOrder: 'asc' | 'desc'
  onToggleSortOrder: () => void
  uniqueCategories: string[]
  isSearchPending: boolean
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  uniqueCategories,
  isSearchPending,
}: TransactionFiltersProps) {
  return (
    <div className="bg-base-100 rounded-xl p-6 shadow-sm mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search transactions..."
                className="input input-bordered flex-1"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="btn btn-ghost btn-square btn-sm"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <span className="bg-base-200">
                {isSearchPending ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  <svg className="w-5 h-5 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </span>
            </div>
            {isSearchPending && (
              <label className="label">
                <span className="label-text-alt text-base-content/50">Searching...</span>
              </label>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <select
            className="select select-bordered w-full"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value as 'all' | 'income' | 'expense')}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            className="select select-bordered w-full"
            value={filterCategory}
            onChange={(e) => onFilterCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex space-x-2">
          <select
            className="select select-bordered flex-1"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'transaction_at' | 'amount')}
          >
            <option value="transaction_at">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <button
            className="btn btn-square btn-outline"
            onClick={onToggleSortOrder}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sortOrder === 'desc' ? (
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