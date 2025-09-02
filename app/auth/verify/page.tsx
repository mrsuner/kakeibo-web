'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useVerifyOtpMutation, useObtainOtpMutation } from '@/lib/store/api'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/lib/store/authSlice'

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const [obtainOtp, { isLoading: isResending }] = useObtainOtpMutation()

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
    
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [searchParams])

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Move to next input if value entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input if backspace pressed on empty field
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setMessage('Please enter the complete 6-digit OTP')
      return
    }

    if (!email) {
      setMessage('Email is missing. Please go back to login.')
      return
    }

    setMessage('')

    try {
      const result = await verifyOtp({ email, otp: otpString }).unwrap()
      
      // Store credentials in Redux (this also saves token to localStorage)
      dispatch(setCredentials({
        user: result.user,
        token: result.access_token
      }))
      
      // Small delay to ensure Redux state is updated before navigation
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error: any) {
      setMessage(error?.data?.message || 'Invalid OTP. Please try again.')
      // Clear OTP fields on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      setMessage('Email is missing. Please go back to login.')
      return
    }

    setMessage('')

    try {
      const result = await obtainOtp({ email }).unwrap()
      setMessage('New OTP sent to your email')
    } catch (error: any) {
      setMessage(error?.data?.message || 'Failed to resend OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Verify Your Email</h1>
            <p className="text-base-content/70">
              We've sent a 6-digit code to your email address. Enter it below to continue.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">6-Digit OTP</span>
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="input input-bordered w-12 h-12 text-center text-xl font-semibold focus:input-primary"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                  />
                ))}
              </div>
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
              disabled={isLoading || isResending}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>

          <div className="divider">Need help?</div>

          <div className="text-center space-y-3">
            <button
              type="button"
              onClick={handleResendOTP}
              className="link link-primary text-sm"
              disabled={isLoading || isResending}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
            
            <br />
            
            <a href="/auth/login" className="link link-neutral text-sm">
              ← Use different email
            </a>
          </div>

          <div className="text-center mt-6">
            <a href="/" className="link link-neutral text-sm">
              ← Back to home
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-base-content/60 text-sm">
          <p>Check your spam folder if you don't see the email</p>
        </div>
      </div>
    </div>
  )
}