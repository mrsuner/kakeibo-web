'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { setDate } from '@/lib/store/features/transactionFormSlice'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/style.css'

export default function DatePicker() {
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.transactionForm)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedDate = formData.date ? new Date(formData.date + 'T00:00:00') : undefined

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch(setDate(format(date, 'yyyy-MM-dd')))
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Date *</span>
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="input input-bordered w-full text-left flex items-center justify-between focus:input-primary"
        >
          <span className={formData.date ? 'text-base-content' : 'text-base-content/60'}>
            {formData.date 
              ? format(selectedDate!, 'MMM dd, yyyy')
              : 'Select date'}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-base-content/60" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 p-4 bg-base-100 rounded-xl shadow-2xl border border-base-200">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="react-day-picker"
              classNames={{
                root: 'text-base-content',
                months: 'flex flex-col sm:flex-row',
                month_caption: 'font-semibold text-base mb-2',
                nav: 'flex items-center justify-between mb-2',
                button_previous: 'btn btn-ghost btn-sm btn-circle',
                button_next: 'btn btn-ghost btn-sm btn-circle',
                month_grid: 'w-full',
                weekdays: 'grid grid-cols-7 text-center',
                weekday: 'text-xs font-medium text-base-content/60 p-2',
                week: 'grid grid-cols-7 text-center',
                day: 'p-0',
                day_button: 'btn btn-ghost btn-sm w-10 h-10 p-0 font-normal hover:bg-primary/10',
                selected: '!bg-primary !text-primary-content hover:!bg-primary',
                today: 'font-bold text-primary',
                outside: 'opacity-40',
                disabled: 'opacity-30 cursor-not-allowed',
                hidden: 'invisible',
              }}
              showOutsideDays
              fixedWeeks
            />
          </div>
        )}
      </div>
    </div>
  )
}