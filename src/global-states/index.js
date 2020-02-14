import React from 'react'
import AuthProvider from './auth'

export default function Provider ({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
