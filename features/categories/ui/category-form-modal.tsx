'use client'

import { useState } from 'react'
import type { Category, CategoryFormPayload } from '../domain/categories.types'

interface CategoryFormModalProps {
  category: Category | null
  onClose: () => void
  onSubmit: (payload: CategoryFormPayload) => void | Promise<void>
  loading?: boolean
}

export function CategoryFormModal({
  category,
  onClose,
  onSubmit,
  loading,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? '')
  const [type, setType] = useState<'income' | 'expense'>(category?.type ?? 'expense')
  const [color, setColor] = useState<string>(category?.color ?? '#808080')
  const [icon, setIcon] = useState<string>(category?.icon ?? '')
  const [description, setDescription] = useState<string>(category?.description ?? '')
  const [budget, setBudget] = useState<string>(category?.budget ? String(category.budget) : '')
  const [budgetPeriod, setBudgetPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | ''>((category?.budgetPeriod as any) ?? '')
  const [isDefault, setIsDefault] = useState<boolean>(category?.isDefault ?? false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    const payload: CategoryFormPayload = {
      name: name.trim(),
      type,
      color,
      icon: icon || undefined,
      description: description || undefined,
      budget: budget ? Number(budget) : undefined,
      budgetPeriod: (budgetPeriod || undefined) as any,
      isDefault: isDefault || undefined,
    }
    setError(null)
    await onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-base-100 rounded-2xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <h2 className="text-xl font-bold">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button className="btn btn-ghost btn-circle" onClick={onClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error py-2 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Groceries" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Type</span></label>
              <select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Color</span></label>
              <div className="flex gap-2">
                <input type="color" className="input input-bordered w-16 p-1" value={color} onChange={(e) => setColor(e.target.value)} />
                <input className="input input-bordered flex-1" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#808080" />
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Icon</span></label>
              <input className="input input-bordered" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Emoji or short text (e.g., 🛒)" />
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label"><span className="label-text">Description</span></label>
              <textarea className="textarea textarea-bordered" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Budget</span></label>
              <input type="number" min="0" step="0.01" className="input input-bordered" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., 250" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Budget Period</span></label>
              <select className="select select-bordered" value={budgetPeriod} onChange={(e) => setBudgetPeriod(e.target.value as any)}>
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-control sm:col-span-2">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                <span className="label-text">Set as default for this type</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-base-200">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} disabled={loading}>
              {loading ? 'Saving…' : category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}