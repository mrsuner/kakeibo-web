'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setTagInput, addTag, removeTag } from '@/lib/store/features/transactionFormSlice'
import { useGetTagsQuery } from '@/lib/store/features/tagApi'

// Custom hook for debounced value
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function TagInput() {
  const dispatch = useAppDispatch()
  const { formData, tagInput } = useAppSelector((state) => state.transactionForm)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce the search input to prevent excessive API calls
  const debouncedSearchInput = useDebounce(tagInput.trim(), 300)

  // Fetch tags with debounced search query
  const { data: availableTags = [] } = useGetTagsQuery(
    { search: debouncedSearchInput },
    { skip: !debouncedSearchInput }
  )

  // Filter out already selected tags and search matching
  const filteredTags = availableTags.filter(tag => 
    !formData.tags.includes(tag.name) &&
    tag.name.toLowerCase().includes(tagInput.toLowerCase())
  )

  // Handle dropdown visibility - show immediately when typing, but search is debounced
  useEffect(() => {
    if (tagInput.trim()) {
      // Show dropdown immediately when user starts typing
      if (debouncedSearchInput && filteredTags.length > 0) {
        setIsDropdownOpen(true)
        setHighlightedIndex(-1)
      } else if (debouncedSearchInput === tagInput.trim()) {
        // Only hide if debounced value matches current input (search is complete)
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
      }
    } else {
      setIsDropdownOpen(false)
      setHighlightedIndex(-1)
    }
  }, [tagInput, debouncedSearchInput, filteredTags.length])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredTags.length > 0) {
        setHighlightedIndex(prev => (prev + 1) % filteredTags.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredTags.length > 0) {
        setHighlightedIndex(prev => (prev - 1 + filteredTags.length) % filteredTags.length)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredTags[highlightedIndex]) {
        dispatch(addTag(filteredTags[highlightedIndex].name))
      } else if (tagInput.trim()) {
        dispatch(addTag(tagInput.trim()))
      }
    } else if (e.key === ',' || e.key === ' ') {
      e.preventDefault()
      if (tagInput.trim()) {
        dispatch(addTag(tagInput.trim()))
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setHighlightedIndex(-1)
      inputRef.current?.blur()
    }
  }

  const handleAddTag = (tagName?: string) => {
    const nameToAdd = tagName || tagInput.trim()
    if (nameToAdd) {
      dispatch(addTag(nameToAdd))
      setIsDropdownOpen(false)
      setHighlightedIndex(-1)
    }
  }

  const handleRemoveTag = (tag: string) => {
    dispatch(removeTag(tag))
  }

  const handleTagSelect = (tagName: string) => {
    handleAddTag(tagName)
  }

  return (
    <div className="form-control">
      <div className="flex items-center gap-4 mb-3">
        <label className="label p-0">
          <span className="label-text font-medium">Tags</span>
        </label>
        <div className="flex-1 flex items-center gap-2 relative" ref={dropdownRef}>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search or add tags..."
              className="input input-bordered input-sm w-full focus:input-primary"
              value={tagInput}
              onChange={(e) => dispatch(setTagInput(e.target.value))}
              onKeyDown={handleTagInputKeyPress}
              onFocus={() => {
                if (tagInput.trim() && (filteredTags.length > 0 || debouncedSearchInput !== tagInput.trim())) {
                  setIsDropdownOpen(true)
                }
              }}
              onBlur={() => {
                // Delay blur to allow click on dropdown items
                setTimeout(() => {
                  if (tagInput.trim() && !isDropdownOpen) {
                    handleAddTag()
                  }
                }, 150)
              }}
            />

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && filteredTags.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-base-100 rounded-lg shadow-xl border border-base-200 max-h-48 overflow-y-auto">
                {filteredTags.slice(0, 10).map((tag, index) => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-base-200 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                      highlightedIndex === index ? 'bg-primary/10 text-primary' : 'text-base-content'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleTagSelect(tag.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{tag.name}</span>
                      {tag.hits > 0 && (
                        <span className="badge badge-ghost badge-xs">
                          {tag.hits} uses
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                
                {/* Show "Create new tag" option if typing something not in results */}
                {tagInput.trim() && !filteredTags.some(tag => 
                  tag.name.toLowerCase() === tagInput.toLowerCase()
                ) && (
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-base-200 border-t border-base-200 text-base-content/70"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleAddTag()}
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create &ldquo;{tagInput.trim()}&rdquo;</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => handleAddTag()}
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
          {formData.tags.map((tag: string) => (
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