"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from './admin-context'
import { Fragment } from 'react'

const AdminPanel = () => {
  const { isAdminPanelOpen, closeAdminPanel } = useAdmin()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalForms: 0,
    visitorChange: 0,
    formChange: 0
  })
  const [showFormModal, setShowFormModal] = useState(false)
  const [formRequests, setFormRequests] = useState<any[]>([])
  const [isFormLoading, setIsFormLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(`Admin action: ${action}`)
    setIsLoading(false)
  }

  const fetchFormRequests = async () => {
    setIsFormLoading(true)
    try {
      const response = await fetch('/api/track-visitor')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFormRequests(data.recentForms.reverse()) // show latest first
        }
      }
    } catch (error) {
      console.error('Error fetching form requests:', error)
    }
    setIsFormLoading(false)
  }

  // Fetch stats when admin panel opens
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/track-visitor')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setStats({
              totalVisitors: data.totalVisitors,
              totalForms: data.totalForms,
              visitorChange: data.visitorChange,
              formChange: data.formChange
            })
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    if (isAdminPanelOpen) {
      fetchStats()
    }
  }, [isAdminPanelOpen])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'logs', name: 'Logs', icon: '📝' },
  ]

  return (
    <AnimatePresence>
      {isAdminPanelOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
                     <motion.div
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
                         <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
                         
                         {/* Stats Cards */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                             {
                               title: 'Total Visitors',
                               value: stats.totalVisitors.toLocaleString(),
                               change: (stats.visitorChange >= 0 ? '+' : '') + stats.visitorChange + '%',
                               color: 'bg-blue-500',
                               changeColor: stats.visitorChange >= 0 ? 'text-green-600' : 'text-red-600',
                               showButton: false
                             },
                             {
                               title: 'Form Requests',
                               value: stats.totalForms.toLocaleString(),
                               change: (stats.formChange >= 0 ? '+' : '') + stats.formChange + '%',
                               color: 'bg-green-500',
                               changeColor: stats.formChange >= 0 ? 'text-green-600' : 'text-red-600',
                               showButton: true
                             }
                           ].map((stat, index) => (
                             <div key={index} className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
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
                                     className="ml-2 px-3 py-1 text-xs rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                     onClick={() => {
                                       setShowFormModal(true)
                                       fetchFormRequests()
                                     }}
                                   >
                                     View Requests
                                   </button>
                                 )}
                               </div>
                             </div>
                           ))}
                         </div>

                                                 {/* Quick Actions */}
                         <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                           <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             {[
                               { name: 'Backup Data', icon: '💾', action: 'backup' },
                               { name: 'Clear Cache', icon: '🗑️', action: 'cache' },
                               { name: 'Update System', icon: '🔄', action: 'update' },
                               { name: 'Export Logs', icon: '📤', action: 'export' },
                             ].map((action, index) => (
                               <button
                                 key={index}
                                 onClick={() => handleAction(action.action)}
                                 disabled={isLoading}
                                 className="p-4 border border-border rounded-[16px] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                               >
                                 <div className="text-2xl mb-2">{action.icon}</div>
                                 <div className="text-sm font-medium text-foreground">{action.name}</div>
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
      {/* Modal for Form Requests */}
      {showFormModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-gray-800"
              onClick={() => setShowFormModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-foreground">Form Requests</h3>
            {isFormLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : formRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No form requests found.</div>
            ) : (
              <div className="space-y-4">
                {formRequests.map((req, idx) => (
                  <div key={req.id && req.id !== '' ? req.id : `form-${idx}`} className="border border-border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{req.name || 'N/A'}</span>
                      <span className="text-xs text-muted-foreground">{new Date(req.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="text-sm">Email:</span>
                      <a href={`mailto:${req.email}`} className="text-blue-600 underline mr-2">{req.email}</a>
                      <a href={`mailto:${req.email}`} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">Email</a>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="text-sm">Phone:</span>
                      <span className="mr-2">{req.phone}</span>
                      <a href={`tel:${req.phone}`} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">Call</a>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="text-sm">Preferred Time:</span>
                      <span>{req.preferredTime || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col mt-2">
                      <span className="text-sm font-medium">Message:</span>
                      <span className="text-sm text-muted-foreground whitespace-pre-line">{req.message || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AdminPanel
