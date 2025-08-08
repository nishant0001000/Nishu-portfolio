"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from './admin-context'
import Toast from './toast'
import { useToast } from '@/hooks/useToast'

// TypeScript interfaces
interface FormRequest {
  _id: string
  id?: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: string
  timestamp?: string
  status?: string
  contacted?: boolean
  ip?: string
  userAgent?: string
  preferredTime?: string
}

interface Visitor {
  _id: string
  id?: string
  ip: string
  userAgent: string
  timestamp: string
  location?: string
  device?: string
  browser?: string
  referer?: string
}

interface Project {
  id?: string
  name: string
  status: string
  budget?: number
  description?: string
  startDate?: string
  endDate?: string
  createdAt?: string
}

interface Client {
  _id: string
  id?: string
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  projects?: Project[]
  notes?: string
  createdAt: string
  totalValue?: number
  totalProjects?: number
  lastContact?: string
}

const AdminPanel = () => {
  const { isAdminPanelOpen, closeAdminPanel } = useAdmin()
  const { toast, showSuccess, showError, hideToast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalForms: 0,
    totalClients: 0,
    visitorChange: 0,
    formChange: 0,
    clientChange: 0
  })
  const [showFormModal, setShowFormModal] = useState(false)
  const [formRequests, setFormRequests] = useState<FormRequest[]>([])
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [showVisitorsModal, setShowVisitorsModal] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [isClientsLoading, setIsClientsLoading] = useState(false)
  const [showClientsModal, setShowClientsModal] = useState(false)
  const [processingFormId, setProcessingFormId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Helper function for safe file download
  const downloadFile = (blob: Blob, filename: string) => {
    try {
      // Modern approach - use URL.createObjectURL with better cleanup
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      
      // Add to DOM, click, and remove safely
      document.body.appendChild(a)
      a.click()
      
      // Clean up with timeout to ensure download starts
      setTimeout(() => {
        try {
          if (document.body.contains(a)) {
            document.body.removeChild(a)
          }
          window.URL.revokeObjectURL(url)
        } catch (cleanupError) {
          console.warn('⚠️ Download cleanup warning:', cleanupError)
        }
      }, 100)
      
      return true
    } catch (error) {
      console.error('❌ Download error:', error)
      return false
    }
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      console.log(`🔧 Admin action: ${action}`)
      
      if (action === 'export_excel') {
        console.log('📊 Starting Excel export...')
        const response = await fetch('/api/export-excel?type=all')
        
        if (response.ok) {
          const blob = await response.blob()
          const filename = `portfolio_data_${new Date().toISOString().split('T')[0]}.csv`
          
          const success = downloadFile(blob, filename)
          if (success) {
            console.log('✅ Excel export completed')
            showSuccess('📊 Data exported successfully! Check your downloads folder.')
          } else {
            throw new Error('Download failed')
          }
        } else {
          throw new Error('Export failed')
        }
      } else if (action === 'backup') {
        console.log('💾 Starting database backup...')
        const response = await fetch('/api/backup-data')
        
        if (response.ok) {
          const blob = await response.blob()
          const filename = `portfolio_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`
          
          const success = downloadFile(blob, filename)
          if (success) {
            console.log('✅ Database backup completed')
            showSuccess('💾 Database backup created successfully! Check your downloads folder.')
          } else {
            throw new Error('Download failed')
          }
        } else {
          throw new Error('Backup failed')
        }
      } else if (action === 'refresh') {
        console.log('🔄 Refreshing dashboard data...')
        
        // Refresh all data without page reload
        await Promise.all([
          fetchFormRequests(),
          fetchClients()
        ])
        
        // Refresh stats
        const fetchStats = async () => {
          try {
            console.log('📊 Refreshing admin dashboard stats...')
            
            // Fetch visitor stats
            const visitorResponse = await fetch('/api/track-visitor')
            let visitorData = { totalVisitors: 0, visitorChange: 0 }
            if (visitorResponse.ok) {
              const data = await visitorResponse.json()
              if (data.success) {
                visitorData = {
                  totalVisitors: data.totalVisitors,
                  visitorChange: data.visitorChange
                }
              }
            }

            // Fetch contact form stats
            const formResponse = await fetch('/api/contact-forms')
            let formData = { totalForms: 0, formChange: 0 }
            if (formResponse.ok) {
              const data = await formResponse.json()
              if (data.success) {
                formData = {
                  totalForms: data.totalForms,
                  formChange: data.formChange
                }
              }
            }

            // Fetch client stats
            const clientResponse = await fetch('/api/clients')
            let clientData = { totalClients: 0, clientChange: 0 }
            if (clientResponse.ok) {
              const data = await clientResponse.json()
              if (data.success) {
                clientData = {
                  totalClients: data.totalClients,
                  clientChange: data.clientChange
                }
              }
            }

            setStats({
              totalVisitors: visitorData.totalVisitors,
              totalForms: formData.totalForms,
              totalClients: clientData.totalClients,
              visitorChange: visitorData.visitorChange,
              formChange: formData.formChange,
              clientChange: clientData.clientChange
            })

            console.log('📈 Stats refreshed successfully:', {
              totalVisitors: visitorData.totalVisitors,
              totalForms: formData.totalForms,
              totalClients: clientData.totalClients,
              visitorChange: visitorData.visitorChange,
              formChange: formData.formChange,
              clientChange: clientData.clientChange
            })
            
          } catch (error) {
            console.error('❌ Error refreshing stats:', error)
          }
        }
        
        await fetchStats()
        
        console.log('✅ Dashboard data refreshed successfully (no page reload)')
        showSuccess('🔄 Dashboard data refreshed successfully!')
        
      } else {
        // Fallback for other actions
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`✅ Action ${action} completed`)
        showSuccess(`Action "${action}" completed successfully!`)
      }
    } catch (error) {
      console.error(`❌ Error in action ${action}:`, error)
      showError(`Error in action "${action}": ${error}`)
    }
    setIsLoading(false)
  }

  const fetchFormRequests = async () => {
    setIsFormLoading(true)
    try {
      console.log('📋 Fetching contact forms from new API...')
      const response = await fetch('/api/contact-forms')
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Contact forms data:', data)
        if (data.success) {
          setFormRequests(data.contactForms) // already sorted by latest first
          console.log(`✅ Loaded ${data.contactForms.length} contact forms`)
        } else {
          console.error('❌ Failed to fetch contact forms:', data.error)
        }
      } else {
        console.error('❌ API response not ok:', response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching form requests:', error)
    }
    setIsFormLoading(false)
  }

  const fetchClients = async () => {
    setIsClientsLoading(true)
    try {
      console.log('👥 Fetching clients...')
      const response = await fetch('/api/clients')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setClients(data.clients || [])
          console.log(`✅ Loaded ${data.clients.length} clients`)
        } else {
          console.error('❌ Failed to fetch clients:', data.error)
        }
      } else {
        console.error('❌ API response not ok:', response.status)
      }
    } catch (error) {
      console.error('❌ Error fetching clients:', error)
    }
    setIsClientsLoading(false)
  }

  const handleFormAction = async (formId: string, action: 'contacted' | 'convert_to_client') => {
    setProcessingFormId(formId)
    try {
      console.log(`🔄 Processing form ${formId} with action: ${action}`)
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: action === 'contacted' ? 'mark_contacted' : 'convert_to_client',
          formId: formId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        console.log(`✅ ${action} successful:`, data.message)
        showSuccess(data.message)
        
        // Refresh form requests to show updated status
        await fetchFormRequests()
        
        // If converted to client, also refresh clients
        if (action === 'convert_to_client') {
          await fetchClients()
        }
      } else {
        console.error(`❌ ${action} failed:`, data.error)
        showError(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error(`❌ Error in ${action}:`, error)
      showError(`Error: ${error}`)
    }
    setProcessingFormId(null)
  }

  // Fetch stats function (reusable)
  const fetchStats = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      console.log('📊 Fetching admin dashboard stats...')
      
      // Fetch visitor stats
      const visitorResponse = await fetch('/api/track-visitor')
      let visitorData = { totalVisitors: 0, visitorChange: 0 }
      if (visitorResponse.ok) {
        const data = await visitorResponse.json()
        if (data.success) {
          visitorData = {
            totalVisitors: data.totalVisitors,
            visitorChange: data.visitorChange
          }
        }
      }

      // Fetch contact form stats
      const formResponse = await fetch('/api/contact-forms')
      let formData = { totalForms: 0, formChange: 0 }
      if (formResponse.ok) {
        const data = await formResponse.json()
        if (data.success) {
          formData = {
            totalForms: data.totalForms,
            formChange: data.formChange
          }
        }
      }

      // Fetch client stats
      const clientResponse = await fetch('/api/clients')
      let clientData = { totalClients: 0, clientChange: 0 }
      if (clientResponse.ok) {
        const data = await clientResponse.json()
        if (data.success) {
          clientData = {
            totalClients: data.totalClients,
            clientChange: data.clientChange
          }
        }
      }

      setStats({
        totalVisitors: visitorData.totalVisitors,
        totalForms: formData.totalForms,
        totalClients: clientData.totalClients,
        visitorChange: visitorData.visitorChange,
        formChange: formData.formChange,
        clientChange: clientData.clientChange
      })

      setLastRefresh(new Date())
      
      console.log('📈 Stats updated:', {
        totalVisitors: visitorData.totalVisitors,
        totalForms: formData.totalForms,
        totalClients: clientData.totalClients,
        visitorChange: visitorData.visitorChange,
        formChange: formData.formChange,
        clientChange: clientData.clientChange
      })
      
    } catch (error) {
      console.error('❌ Error fetching stats:', error)
    } finally {
      if (showLoading) setIsRefreshing(false)
    }
  }

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Refresh all data
      await Promise.all([
        fetchStats(false), // Don't show loading twice
        fetchFormRequests(),
        fetchClients()
      ])
      console.log('🔄 All dashboard data refreshed successfully')
      showSuccess('🔄 Dashboard data refreshed successfully!')
    } catch (error) {
      console.error('❌ Error refreshing dashboard:', error)
      showError('❌ Failed to refresh dashboard data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Fetch stats when admin panel opens
  useEffect(() => {
    if (isAdminPanelOpen) {
      fetchStats()
    }
  }, [isAdminPanelOpen])

  // Auto-refresh every 30 seconds when admin panel is open
  useEffect(() => {
    if (!isAdminPanelOpen) return

    const interval = setInterval(() => {
      fetchStats()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAdminPanelOpen])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'logs', name: 'Logs', icon: '📝' },
  ]

  return (
    <>
      {/* Main Admin Panel */}
      <AnimatePresence>
        {isAdminPanelOpen && (
          <motion.div
            key="admin-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              key="admin-panel-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-7xl h-[90vh] bg-neutral-50 dark:bg-neutral-800 rounded-[24px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-[16px] flex items-center justify-center shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={closeAdminPanel}
                    className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-[16px] transition-colors flex items-center space-x-2 shadow-xs"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                  <button
                    onClick={closeAdminPanel}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-neutral-50 dark:bg-neutral-800 p-4 border-r border-border">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[16px] transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                            <div className="flex items-center gap-3">
                              {lastRefresh && (
                                <span className="text-xs text-muted-foreground">
                                  Last updated: {lastRefresh.toLocaleTimeString()}
                                </span>
                              )}
                              <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
                              >
                                <span className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`}>
                                  🔄
                                </span>
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              {
                                title: 'Total Visitors',
                                value: stats.totalVisitors.toLocaleString(),
                                change: (stats.visitorChange >= 0 ? '+' : '') + stats.visitorChange + '%',
                                color: 'bg-blue-500',
                                changeColor: stats.visitorChange >= 0 ? 'text-green-600' : 'text-red-600',
                                showButton: true,
                                buttonText: 'View Visitors',
                                buttonAction: () => {
                                  setShowVisitorsModal(true)
                                }
                              },
                              {
                                title: 'Form Requests',
                                value: stats.totalForms.toLocaleString(),
                                change: (stats.formChange >= 0 ? '+' : '') + stats.formChange + '%',
                                color: 'bg-green-500',
                                changeColor: stats.formChange >= 0 ? 'text-green-600' : 'text-red-600',
                                showButton: true,
                                buttonText: 'View Requests',
                                buttonAction: () => {
                                  setShowFormModal(true)
                                  fetchFormRequests()
                                }
                              },
                              {
                                title: 'Active Clients',
                                value: (stats.totalClients || 0).toLocaleString(),
                                change: (stats.clientChange >= 0 ? '+' : '') + (stats.clientChange || 0) + '%',
                                color: 'bg-purple-500',
                                changeColor: (stats.clientChange || 0) >= 0 ? 'text-green-600' : 'text-red-600',
                                showButton: true,
                                buttonText: 'Manage Clients',
                                buttonAction: () => {
                                  setShowClientsModal(true)
                                  fetchClients()
                                }
                              }
                            ].map((stat, index) => (
                              <div key={`dashboard-stat-${index}`} className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                  </div>
                                  <div className={`w-12 h-12 ${stat.color} rounded-[16px] flex items-center justify-center shadow-xs`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <p className={`text-sm ${stat.changeColor}`}>{stat.change} from last month</p>
                                  {stat.showButton && (
                                    <button
                                      className="ml-2 px-3 py-1 text-xs rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                      onClick={stat.buttonAction}
                                    >
                                      {stat.buttonText}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Actions */}
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { name: 'Export as Excel', icon: '📊', action: 'export_excel', description: 'Download all data as CSV file' },
                                { name: 'Backup Database', icon: '💾', action: 'backup', description: 'Create complete database backup' },
                                { name: 'Refresh Data', icon: '🔄', action: 'refresh', description: 'Refresh all dashboard data' },
                              ].map((action, index) => (
                                <button
                                  key={`action-${index}`}
                                  onClick={() => handleAction(action.action)}
                                  disabled={isLoading}
                                  className="p-4 border border-border rounded-[16px] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 text-center"
                                  title={action.description || action.name}
                                >
                                  <div className="text-2xl mb-2">{action.icon}</div>
                                  <div className="text-sm font-medium text-foreground">{action.name}</div>
                                  {action.description && (
                                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'analytics' && (
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-6">Analytics</h2>
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <p className="text-muted-foreground">Analytics data will be displayed here...</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'users' && (
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-6">User Management</h2>
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <p className="text-muted-foreground">User management interface will be displayed here...</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'settings' && (
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <p className="text-muted-foreground">System settings will be displayed here...</p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'logs' && (
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-6">System Logs</h2>
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <p className="text-muted-foreground">System logs will be displayed here...</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal for Form Requests */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            key="form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden p-6 relative"
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
                onClick={() => setShowFormModal(false)}
              >
                &times;
              </button>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Contact Form Requests</h3>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Total: {formRequests.length} forms
                  </div>
                  <button
                    onClick={fetchFormRequests}
                    disabled={isFormLoading}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded transition-colors"
                  >
                    <span className={`${isFormLoading ? 'animate-spin' : ''}`}>🔄</span>
                    {isFormLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
              {isFormLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading contact forms...
                </div>
              ) : formRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No contact form requests found.</p>
                  <p className="text-xs mt-1">Forms are automatically deleted after 15 days.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {formRequests.map((req, idx) => (
                    <div key={`form-request-${req._id || req.id || idx}`} className="border border-border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      {/* Header with name and timestamp */}
                      <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="font-semibold text-foreground text-lg">{req.name || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">{new Date(req.timestamp || req.createdAt).toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">IP: {req.ip || 'Unknown'}</span>
                        </div>
                      </div>

                      {/* Contact Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📧 Email:</span>
                          <a href={`mailto:${req.email}`} className="text-blue-600 hover:text-blue-800 underline flex-1 truncate">{req.email}</a>
                          <a href={`mailto:${req.email}?subject=Re: Contact from Portfolio&body=Hi ${req.name},%0D%0A%0D%0AThank you for contacting me through my portfolio.%0D%0A%0D%0ABest regards,%0D%0ANishant`} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">Reply</a>
                        </div>
                        
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📞 Phone:</span>
                          <span className="flex-1">{req.phone || 'N/A'}</span>
                          {req.phone && (
                            <a href={`tel:${req.phone}`} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">Call</a>
                          )}
                        </div>
                      </div>

                      {/* Preferred Time */}
                      {req.preferredTime && (
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border mb-3">
                          <span className="text-sm font-medium">⏰ Preferred Time:</span>
                          <span className="text-sm">{req.preferredTime}</span>
                        </div>
                      )}

                      {/* Message */}
                      <div className="p-3 bg-white dark:bg-neutral-900 rounded border mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">💬 Message:</span>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-line bg-gray-50 dark:bg-neutral-800 p-2 rounded max-h-24 overflow-y-auto">
                          {req.message || 'No message provided'}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {req.status && (
                        <div className="mt-3 mb-3">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                            req.status === 'contacted' 
                              ? 'bg-blue-100 text-blue-800' 
                              : req.status === 'converted_to_client'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {req.status === 'contacted' ? '📞 Contacted' : 
                             req.status === 'converted_to_client' ? '👤 Client' : 
                             '📝 New Request'}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleFormAction(req.id || req._id, 'contacted')}
                          disabled={processingFormId === (req.id || req._id) || req.status === 'contacted' || req.status === 'converted_to_client'}
                          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                            req.status === 'contacted' || req.status === 'converted_to_client'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {processingFormId === (req.id || req._id) ? '⏳ Processing...' : '📞 Mark as Contacted'}
                        </button>
                        
                        <button
                          onClick={() => handleFormAction(req.id || req._id, 'convert_to_client')}
                          disabled={processingFormId === (req.id || req._id) || req.status === 'converted_to_client'}
                          className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                            req.status === 'converted_to_client'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {processingFormId === (req.id || req._id) ? '⏳ Processing...' : '👤 Convert to Client'}
                        </button>
                      </div>

                      {/* User Agent (collapsible) */}
                      {req.userAgent && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            🔍 Technical Details
                          </summary>
                          <div className="text-xs text-muted-foreground mt-1 p-2 bg-gray-50 dark:bg-neutral-800 rounded">
                            <strong>User Agent:</strong> {req.userAgent}
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal for Website Visitors */}
      <AnimatePresence>
        {showVisitorsModal && (
          <motion.div
            key="visitors-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden p-6 relative"
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
                onClick={() => setShowVisitorsModal(false)}
              >
                &times;
              </button>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">👥 Website Visitors</h3>
              </div>
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-2xl font-bold text-foreground mb-2">
                  {(stats.totalVisitors || 0).toLocaleString()} Total Visitors
                </h4>
                <p className="text-muted-foreground mb-6">
                  Visitors are counted for privacy - individual data is not stored
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                    <span className="text-lg">🔒</span>
                    <span className="font-medium">Privacy First Approach</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    We only count visitors to respect privacy. Detailed information (location, device, etc.) 
                    is only collected when someone voluntarily submits the contact form.
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
                    <span className="text-lg">📝</span>
                    <span className="font-medium">Form Submissions</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Detailed visitor data is available in the &quot;Contact Forms&quot; section for users who 
                    voluntarily submit the contact form.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal for Client Management */}
      <AnimatePresence>
        {showClientsModal && (
          <motion.div
            key="clients-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-hidden p-6 relative"
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
                onClick={() => setShowClientsModal(false)}
              >
                &times;
              </button>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Client Management</h3>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Total: {clients.length} clients
                  </div>
                  <button
                    onClick={fetchClients}
                    disabled={isClientsLoading}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded transition-colors"
                  >
                    <span className={`${isClientsLoading ? 'animate-spin' : ''}`}>🔄</span>
                    {isClientsLoading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
              {isClientsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading clients...
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No clients found.</p>
                  <p className="text-xs mt-1">Convert form requests to clients to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  {clients.map((client, idx) => (
                    <div key={`client-${client._id || client.id || idx}`} className="border border-border rounded-lg p-6 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      {/* Client Header */}
                      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {client.name ? client.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">{client.name}</h4>
                            <p className="text-sm text-muted-foreground">Client since {new Date(client.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                            client.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {client.totalProjects || 0} project{(client.totalProjects || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📧 Email:</span>
                          <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800 underline flex-1 truncate">{client.email}</a>
                        </div>
                        
                        <div className="flex items-center gap-2 p-3 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📞 Phone:</span>
                          <span className="flex-1">{client.phone || 'N/A'}</span>
                          {client.phone && (
                            <a href={`tel:${client.phone}`} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">Call</a>
                          )}
                        </div>
                      </div>

                      {/* Projects Section */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-foreground">📁 Projects ({client.projects?.length || 0})</h5>
                          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors">
                            + Add Project
                          </button>
                        </div>
                        
                        {client.projects && client.projects.length > 0 ? (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {client.projects.map((project: Project, projectIdx: number) => (
                              <div key={`project-${project.id || projectIdx}`} className="flex items-center justify-between p-2 bg-white dark:bg-neutral-900 rounded border text-sm">
                                <div className="flex-1">
                                  <span className="font-medium">{project.name}</span>
                                  <span className="text-muted-foreground ml-2">({project.status})</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {project.budget && `${project.budget}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-sm bg-white dark:bg-neutral-900 rounded border">
                            No projects assigned yet
                          </div>
                        )}
                      </div>

                      {/* Notes Section */}
                      {client.notes && (
                        <div className="mb-4">
                          <h5 className="font-medium text-foreground mb-2">📝 Notes</h5>
                          <div className="p-3 bg-white dark:bg-neutral-900 rounded border text-sm text-muted-foreground">
                            {client.notes}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
                        <button className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                          📧 Send Email
                        </button>
                        <button className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                          📁 Add Project
                        </button>
                        <button className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors">
                          ✏️ Edit Client
                        </button>
                        <button className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
                          🗑️ Delete
                        </button>
                      </div>

                      {/* Last Contact */}
                      {client.lastContact && (
                        <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
                          Last contact: {new Date(client.lastContact).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  )
}

export default AdminPanel