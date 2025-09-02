'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetMeQuery, useUpdateMeMutation, useGetCurrenciesQuery, useGetMeStatsQuery } from '@/lib/store/api'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  const { data: user, isLoading: isLoadingUser } = useGetMeQuery()
  const { data: currencies, isLoading: isLoadingCurrencies } = useGetCurrenciesQuery()
  const { data: stats, isLoading: isLoadingStats } = useGetMeStatsQuery()
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation()

  const [profileData, setProfileData] = useState({
    name: '',
    timezone: '',
    language: '',
    month_start: 1,
    week_start: 0,
    avatar: '',
  })

  const [originalData, setOriginalData] = useState(profileData)

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        timezone: user.timezone || '',
        language: user.language || '',
        month_start: user.month_start || 1,
        week_start: user.week_start || 0,
        avatar: user.avatar || '',
      }
      setProfileData(userData)
      setOriginalData(userData)
    }
  }, [user])

  const timezones = [
    'UTC', 
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Seoul', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Dubai', 'Asia/Kolkata',
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth',
    'Africa/Cairo', 'Africa/Lagos', 'Africa/Johannesburg'
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ]

  const weekStartOptions = [
    { value: 0, name: 'Sunday' },
    { value: 1, name: 'Monday' },
    { value: 6, name: 'Saturday' }
  ]

  const monthStartOptions = Array.from({ length: 28 }, (_, i) => i + 1)

  const handleInputChange = (field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData(profileData)
    setMessage('')
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
    setMessage('')
  }

  const handleSave = async () => {
    setMessage('')

    try {
      await updateMe(profileData).unwrap()
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setOriginalData(profileData)
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    }
  }

  const getInitials = () => {
    if (!user?.name) return 'U'
    const parts = user.name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return user.name.charAt(0).toUpperCase()
  }

  if (isLoadingUser || isLoadingCurrencies || isLoadingStats) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-error">Failed to load user profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn btn-ghost btn-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-base-content">Profile</h1>
            <p className="text-base-content/70 mt-1">Manage your personal information and preferences</p>
          </div>
        </div>
        
        {!isEditing && (
          <button onClick={handleEdit} className="btn btn-outline btn-primary btn-sm">
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {getInitials()}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-1">
            {user.name || 'User'}
          </h2>
          <p className="text-base-content/70">{user.email}</p>
        </div>

        {/* Profile Form */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-base-content mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered focus:input-primary"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered bg-base-200"
                    value={user.email}
                    disabled
                    title="Email cannot be changed once verified"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    className="input input-bordered bg-base-200"
                    value={user.phone_number ? `${user.phone_dial_code}${user.phone_number}` : 'Not set'}
                    disabled
                    title="Phone number cannot be changed once verified"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Gender</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered bg-base-200"
                    value={user.gender || 'Not set'}
                    disabled
                    title="Gender cannot be changed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Base Currency</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered bg-base-200"
                    value={user.base_currency || 'Not set'}
                    disabled
                    title="Base currency cannot be changed"
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-base-content mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Timezone</span>
                  </label>
                  <select 
                    className="select select-bordered focus:select-primary"
                    value={profileData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    disabled={!isEditing}
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Language</span>
                  </label>
                  <select 
                    className="select select-bordered focus:select-primary"
                    value={profileData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    disabled={!isEditing}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Month Start Day</span>
                  </label>
                  <select 
                    className="select select-bordered focus:select-primary"
                    value={profileData.month_start}
                    onChange={(e) => handleInputChange('month_start', parseInt(e.target.value))}
                    disabled={!isEditing}
                  >
                    {monthStartOptions.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Week Start</span>
                  </label>
                  <select 
                    className="select select-bordered focus:select-primary"
                    value={profileData.week_start}
                    onChange={(e) => handleInputChange('week_start', parseInt(e.target.value))}
                    disabled={!isEditing}
                  >
                    {weekStartOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  {message.includes('success') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span>{message}</span>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCancel}
                  className="btn btn-outline flex-1"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary flex-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-xl p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-primary">
            {stats?.total_transactions ?? 0}
          </div>
          <div className="text-base-content/70">Total Transactions</div>
        </div>
        <div className="bg-base-100 rounded-xl p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-success">
            {stats?.active_accounts ?? 0}
          </div>
          <div className="text-base-content/70">Active Accounts</div>
        </div>
        <div className="bg-base-100 rounded-xl p-6 text-center shadow-lg">
          <div className="text-2xl font-bold text-info">
            {stats?.days_active ?? 0}
          </div>
          <div className="text-base-content/70">Days Active</div>
        </div>
      </div>
    </div>
  )
}