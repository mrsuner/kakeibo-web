// Auth helper functions for JWT token management
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}