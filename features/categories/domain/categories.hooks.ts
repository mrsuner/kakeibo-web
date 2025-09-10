import { useMemo } from 'react'
import type { Category, CategoryFilters } from './categories.types'

export function useCategoryIcon(category: Category): string {
  return useMemo(() => {
    if (category.icon) return category.icon
    const n = category.name.toLowerCase()
    if (n.includes('food')) return '🍽️'
    if (n.includes('transport')) return '🚗'
    if (n.includes('shopping')) return '🛍️'
    if (n.includes('entertainment')) return '🎮'
    if (n.includes('salary') || n.includes('income')) return '💰'
    return category.type === 'income' ? '💵' : '💸'
  }, [category.icon, category.name, category.type])
}

export function useFilteredCategories(categories: Category[], filters: CategoryFilters): Category[] {
  return useMemo(() => {
    let list = [...categories]

    // Status filter
    if (filters.statusFilter !== 'all') {
      list = list.filter((c) => (filters.statusFilter === 'active' ? c.isActive : !c.isActive))
    }

    // Search filter
    if (filters.search) {
      const s = filters.search.toLowerCase()
      list = list.filter((c) => 
        c.name.toLowerCase().includes(s) || 
        c.description?.toLowerCase().includes(s)
      )
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0
      if (filters.sortBy === 'name') {
        cmp = a.name.localeCompare(b.name)
      } else {
        cmp = (a.hits || 0) - (b.hits || 0)
      }
      return filters.sortOrder === 'asc' ? cmp : -cmp
    })

    return list
  }, [categories, filters])
}

export function useCategoryStats(categories: Category[]) {
  return useMemo(() => ({
    total: categories.length,
    incomeCount: categories.filter((c) => c.type === 'income').length,
    expenseCount: categories.filter((c) => c.type === 'expense').length,
  }), [categories])
}