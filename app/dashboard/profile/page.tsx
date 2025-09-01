'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    profilePicture: null as File | null
  })

  const [originalData, setOriginalData] = useState(profileData)

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai'
  ]

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' }
  ]

  const dateFormats = [
    'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY'
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setProfileData(prev => ({
      ...prev,
      profilePicture: file
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
    setIsLoading(true)
    setMessage('')

    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulated delay
      
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      setOriginalData(profileData)
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = () => {
    return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="btn btn-ghost btn-sm"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-primary">Profile</h1>
            </div>
            
            {!isEditing && (
              <button onClick={handleEdit} className="btn btn-outline btn-primary btn-sm">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {getInitials()}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profile-picture" className="btn btn-primary btn-circle btn-xs cursor-pointer">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </label>
                  <input 
                    id="profile-picture"
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-1">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-base-content/70">{profileData.email}</p>
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
                      <span className="label-text font-medium">First Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered focus:input-primary"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Last Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered focus:input-primary"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered focus:input-primary"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Phone</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered focus:input-primary"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
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
                      <span className="label-text font-medium">Currency</span>
                    </label>
                    <select 
                      className="select select-bordered focus:select-primary"
                      value={profileData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      disabled={!isEditing}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-medium">Date Format</span>
                  </label>
                  <select 
                    className="select select-bordered focus:select-primary md:w-1/2"
                    value={profileData.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    disabled={!isEditing}
                  >
                    {dateFormats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
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
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
            <div className="text-2xl font-bold text-primary">247</div>
            <div className="text-base-content/70">Total Transactions</div>
          </div>
          <div className="bg-base-100 rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-success">3</div>
            <div className="text-base-content/70">Active Accounts</div>
          </div>
          <div className="bg-base-100 rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-info">89</div>
            <div className="text-base-content/70">Days Active</div>
          </div>
        </div>
      </main>
    </div>
  )
}