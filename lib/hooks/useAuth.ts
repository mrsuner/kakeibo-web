import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '../store'
import { initializeAuth, logout, setLoading } from '../store/authSlice'
import { useGetMeQuery } from '../store/api'

export function useAuth() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isAuthenticated, isLoading, token, user } = useSelector((state: RootState) => state.auth)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const validationInterval = parseInt(process.env.NEXT_PUBLIC_TOKEN_VALIDATION_INTERVAL || '60000')

  // Skip the query if not authenticated or no token
  const { 
    data: currentUser, 
    error: meError, 
    isLoading: isFetchingMe,
    refetch: refetchMe 
  } = useGetMeQuery(undefined, {
    skip: !isAuthenticated || !token,
  })

  // Initialize auth state on mount
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Handle authentication errors (token expired/invalid) - baseApi now handles this
  useEffect(() => {
    if (meError && 'status' in meError && meError.status === 401) {
      // Redirect to login - baseApi already handled cleanup
      router.push('/auth/login')
    }
  }, [meError, router])

  // Set up token validation interval when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isLoading) {
      // Initial validation
      refetchMe()

      // Set up interval for periodic validation
      intervalRef.current = setInterval(() => {
        refetchMe()
      }, validationInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      // Clear interval if not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAuthenticated, token, isLoading, refetchMe, validationInterval])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/auth/login')
  }

  return {
    isAuthenticated,
    isLoading: isLoading || isFetchingMe,
    user: currentUser || user,
    token,
    logout: handleLogout,
  }
}