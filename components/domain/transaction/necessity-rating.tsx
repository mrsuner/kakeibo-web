'use client'

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setNecessityRating } from '@/lib/store/features/transactionFormSlice'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

export default function NecessityRating() {
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.transactionForm)

  // Only show for expense transactions
  if (formData.type !== 'expense') {
    return null
  }

  // Custom necessity level shape for rating - using a diamond/priority indicator
  const necessityShape = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z"/>
    </svg>
  )

  const ratingStyles = {
    itemShapes: necessityShape,
    activeFillColor: '#f59e0b', // Orange/amber color for necessity
    inactiveFillColor: '#e5e7eb',
    itemStrokeWidth: 1,
    activeStrokeColor: '#d97706',
    inactiveStrokeColor: '#d1d5db'
  }

  const getNecessityLabel = (rating: number) => {
    if (rating <= 2) return 'Essential'
    if (rating <= 4) return 'Important'
    if (rating <= 6) return 'Moderate'
    if (rating <= 8) return 'Optional'
    return 'Impulse'
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Necessity Rating</span>
        <span className="label-text-alt">Rate from 0-10 (each ⬦ = 2 points)</span>
      </label>
      <div className="flex items-center gap-4">
        <Rating
          style={{ maxWidth: 200 }}
          value={formData.necessityRating / 2}
          onChange={(value: number) => dispatch(setNecessityRating(value * 2))}
          itemStyles={ratingStyles}
          halfFillMode="svg"
          items={5}
        />
        <div className="text-sm text-base-content/70">
          <span className="font-semibold">{formData.necessityRating}/10</span>
          <div className="text-xs">
            {getNecessityLabel(formData.necessityRating)}
          </div>
        </div>
      </div>
    </div>
  )
}