'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/lib/store/authSlice'
import { useGetMeQuery } from '@/lib/store/api'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      // Store token in localStorage immediately so useGetMeQuery can use it
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token)
      }
    } else {
      router.push('/auth/login')
    }
  }, [token, router])

  // Use the token to get user info
  const { data: user, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token
  })

  useEffect(() => {
    if (token && user) {
      // Store credentials in Redux (this also saves to localStorage)
      dispatch(setCredentials({
        user: user,
        token: token
      }))
      
      // Small delay to ensure Redux state is updated before navigation
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } else if (error) {
      // Invalid token, redirect to login (logout action handles localStorage cleanup)
      router.push('/auth/login')
    }
  }, [token, user, error, dispatch, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-2">Invalid Link</h1>
          <p className="text-base-content/70 mb-4">This authentication link is invalid or has expired.</p>
          <a href="/auth/login" className="btn btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70">Completing authentication...</p>
      </div>
    </div>
  )
}