'use client'

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setTagInput, addTag, removeTag } from '@/lib/store/features/transactionFormSlice'

export default function TagInput() {
  const dispatch = useAppDispatch()
  const { formData, tagInput } = useAppSelector((state) => state.transactionForm)

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      if (tagInput.trim()) {
        dispatch(addTag(tagInput))
      }
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      dispatch(addTag(tagInput))
    }
  }

  const handleRemoveTag = (tag: string) => {
    dispatch(removeTag(tag))
  }

  return (
    <div className="form-control">
      <div className="flex items-center gap-4 mb-3">
        <label className="label p-0">
          <span className="label-text font-medium">Tags</span>
        </label>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add tags (press Enter, comma, or space)"
            className="input input-bordered input-sm flex-1 focus:input-primary"
            value={tagInput}
            onChange={(e) => dispatch(setTagInput(e.target.value))}
            onKeyDown={handleTagInputKeyPress}
            onBlur={() => tagInput && handleAddTag()}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="btn btn-primary btn-sm"
            disabled={!tagInput.trim()}
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Display Tags */}
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="badge badge-primary badge-lg gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="btn btn-ghost btn-circle btn-xs hover:btn-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}