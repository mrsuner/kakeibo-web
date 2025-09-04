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
      </label>
      <div className="flex items-center gap-4">
        <Rating
          style={{ maxWidth: 200 }}
          value={formData.necessityRating / 2}
          onChange={(value: number) => dispatch(setNecessityRating(value * 2))}
          halfFillMode="svg"
          readOnly={false}
          allowFraction
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