'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useObtainOtpMutation } from '@/lib/store/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  
  const [obtainOtp, { isLoading }] = useObtainOtpMutation()

  const handleGetOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Please enter your email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Please enter a valid email address')
      return
    }

    setMessage('')

    try {
      const result = await obtainOtp({ email }).unwrap()
      setMessage(result.message)
      
      // Redirect to verify page with email
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
      }, 1500)
    } catch (error: any) {
      setMessage(error?.data?.message || 'Failed to send OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Kakeibo</h1>
            <p className="text-base-content/70">Enter your email to get started with password-less login</p>
          </div>

          <form onSubmit={handleGetOTP} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full focus:input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {message && (
              <div className={`alert ${message.includes('sent') ? 'alert-success' : 'alert-error'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  {message.includes('sent') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending OTP...
                </>
              ) : (
                'Get OTP'
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-base-content/70 text-sm">
              Already have an OTP?{' '}
              <a href="/auth/verify" className="link link-primary font-medium">
                Verify OTP
              </a>
            </p>
          </div>

          <div className="text-center mt-6">
            <a href="/" className="link link-neutral text-sm">
              ← Back to home
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-base-content/60 text-sm">
          <p>Secure, password-less authentication powered by email verification</p>
        </div>
      </div>
    </div>
  )
}