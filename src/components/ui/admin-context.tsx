"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getDeviceInfo, getLocationInfo } from '@/lib/device-info'

interface AdminContextType {
  clickCount: number
  isAdminPanelOpen: boolean
  isPasswordModalOpen: boolean
  incrementClickCount: () => void
  resetClickCount: () => void
  openAdminPanel: () => void
  closeAdminPanel: () => void
  openPasswordModal: () => void
  closePasswordModal: () => void
  checkPassword: (password: string) => boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clickCount, setClickCount] = useState(0)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  // Reset click count after 5 seconds of inactivity
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [clickCount])

  const incrementClickCount = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount === 8) {
      openPasswordModal()
    }
  }

  const resetClickCount = () => {
    setClickCount(0)
  }

  const openAdminPanel = async () => {
    // Only open admin panel after successful password verification
    setIsAdminPanelOpen(true)
    setIsPasswordModalOpen(false)
    
    // Send login notification
    try {
      const deviceInfo = getDeviceInfo()
      const locationInfo = await getLocationInfo()
      const timestamp = new Date().toLocaleString()
      
      
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceInfo,
          location: locationInfo,
          timestamp
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
      } else {
        console.error('❌ Failed to send admin login notification:', result.error)
      }
    } catch (error) {
      console.error('❌ Error sending login notification:', error)
    }
  }

  const closeAdminPanel = () => {
    setIsAdminPanelOpen(false)
    resetClickCount()
  }

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true)
  }

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    resetClickCount()
  }

  const checkPassword = (password: string): boolean => {
    // Get password from environment variable
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"
    if (password === correctPassword) {
      openAdminPanel()
      return true
    }
    return false
  }

  const value: AdminContextType = {
    clickCount,
    isAdminPanelOpen,
    isPasswordModalOpen,
    incrementClickCount,
    resetClickCount,
    openAdminPanel,
    closeAdminPanel,
    openPasswordModal,
    closePasswordModal,
    checkPassword,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
