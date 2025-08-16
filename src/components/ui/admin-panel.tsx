"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from './admin-context'
import { useHomepage } from './homepage-context'
import Toast from './toast'
import { useToast } from '@/hooks/useToast'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import { Textarea } from './textarea'
import MinimalCard, { MinimalCardDescription, MinimalCardImage, MinimalCardTitle } from './minimal-card'

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
  const { content, updateHero, updateImages, updateSEO, saveChanges, hasUnsavedChanges, resetToDefault } = useHomepage()
  
  // Check if content is loaded
  const isContentLoaded = content && content.hero && content.images && content.seo
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
  const [highlightClientId, setHighlightClientId] = useState<string | null>(null)
  const [isEditingClient, setIsEditingClient] = useState(false)
  const [editClientData, setEditClientData] = useState<{ clientId: string; name: string; email: string; phone: string; status: string; notes: string }>({ clientId: '', name: '', email: '', phone: '', status: 'active', notes: '' })
  const [isSavingClient, setIsSavingClient] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [projectClientId, setProjectClientId] = useState<string>('')
  const [projectData, setProjectData] = useState<{ name: string; description: string; status: string; startDate: string; endDate: string; budget: string; category: string }>({ name: '', description: '', status: 'planning', startDate: '', endDate: '', budget: '', category: 'Website' })
  const [isSavingProject, setIsSavingProject] = useState(false)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [processingFormId, setProcessingFormId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [formSearch, setFormSearch] = useState("")
  const [formStatus, setFormStatus] = useState<'all' | 'new' | 'contacted' | 'converted'>("new")
  const [formSort, setFormSort] = useState<'newest' | 'oldest'>("newest")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [projectImage, setProjectImage] = useState('')
  const [techInput, setTechInput] = useState('')
  const [projectLink, setProjectLink] = useState('')
  // Edit Projects (DB)
  const [projectsDB, setProjectsDB] = useState<any[]>([])
  const [isProjectsLoading, setIsProjectsLoading] = useState(false)
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false)
  const [editProject, setEditProject] = useState<{ _id?: string; title: string; description: string; technologies: string; link: string; imageUrl: string; category: string }>({ title: '', description: '', technologies: '', link: '', imageUrl: '', category: 'Website' })
  // Manage Categories
  const [categories, setCategories] = useState<any[]>([])
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', color: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30' })
  const [editingCategory, setEditingCategory] = useState<any>(null)

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
      
      if (action === 'export_excel') {
        const response = await fetch('/api/export-excel?type=all')
        
        if (response.ok) {
          const blob = await response.blob()
          const filename = `portfolio_data_${new Date().toISOString().split('T')[0]}.csv`
          
          const success = downloadFile(blob, filename)
          if (success) {
            showSuccess('📊 Data exported successfully! Check your downloads folder.')
          } else {
            throw new Error('Download failed')
          }
        } else {
          throw new Error('Export failed')
        }
      } else if (action === 'backup') {
        const response = await fetch('/api/backup-data')
        
        if (response.ok) {
          const blob = await response.blob()
          const filename = `portfolio_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`
          
          const success = downloadFile(blob, filename)
          if (success) {
            showSuccess('💾 Database backup created successfully! Check your downloads folder.')
          } else {
            throw new Error('Download failed')
          }
        } else {
          throw new Error('Backup failed')
        }
      } else if (action === 'refresh') {
        
        // Refresh all data without page reload
        await Promise.all([
          fetchFormRequests(),
          fetchClients()
        ])
        
        // Refresh stats
        const fetchStats = async () => {
          try {
            
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
            
          } catch (error) {
            console.error('❌ Error fetching stats:', error)
          }
         }
         
         await fetchStats()
         
         showSuccess('🔄 Dashboard data refreshed successfully!')
         
       } else {
        // Fallback for other actions
        await new Promise(resolve => setTimeout(resolve, 1000))
        showSuccess(`Action "${action}" completed successfully!`)
      }
    } catch (error) {
      console.error(`❌ Error in action ${action}:`, error)
      showError(`Error in action "${action}": ${error}`)
    }
    setIsLoading(false)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess(`${label} copied to clipboard`)
    } catch (err) {
      showError('Failed to copy')
    }
  }

  const filteredFormRequests = useMemo(() => {
    const query = formSearch.trim().toLowerCase()
    let list = [...formRequests]

    if (formStatus !== 'all') {
      if (formStatus === 'new') {
        list = list.filter(req => !req.status)
      } else if (formStatus === 'contacted') {
        list = list.filter(req => req.status === 'contacted')
      } else if (formStatus === 'converted') {
        list = list.filter(req => req.status === 'converted_to_client')
      }
    }

    if (query) {
      list = list.filter(req => {
        const haystack = [
          req.name,
          req.email,
          req.phone || '',
          req.message || ''
        ].join(' ').toLowerCase()
        return haystack.includes(query)
      })
    }

    list.sort((a, b) => {
      const ta = new Date(a.timestamp || a.createdAt).getTime()
      const tb = new Date(b.timestamp || b.createdAt).getTime()
      return formSort === 'newest' ? tb - ta : ta - tb
    })

    return list
  }, [formRequests, formSearch, formStatus, formSort])

  const exportFilteredFormsToCsv = () => {
    if (!filteredFormRequests.length) {
      showError('No forms to export')
      return
    }
    const headers = ['Name','Email','Phone','Preferred Time','Message','IP','User Agent','Timestamp','Status']
    const rows = filteredFormRequests.map(r => [
      r.name,
      r.email,
      r.phone || '',
      r.preferredTime || '',
      (r.message || '').replace(/\n/g, ' '),
      r.ip || '',
      r.userAgent || '',
      new Date(r.timestamp || r.createdAt).toLocaleString(),
      r.status || 'new'
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const filename = `contact_forms_${new Date().toISOString().split('T')[0]}.csv`
    const success = downloadFile(blob as unknown as Blob, filename)
    if (success) {
      showSuccess('Exported filtered forms to CSV')
    }
  }

  const fetchFormRequests = async () => {
    setIsFormLoading(true)
    try {
      const response = await fetch('/api/contact-forms')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFormRequests(data.contactForms) // already sorted by latest first
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
      const response = await fetch('/api/clients')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setClients(data.clients || [])
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

  const handleFormAction = async (
    formId: string,
    action: 'contacted' | 'convert_to_client' | 'unmark_contacted'
  ) => {
    setProcessingFormId(formId)
    try {
      
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action:
            action === 'contacted'
              ? 'mark_contacted'
              : action === 'unmark_contacted'
              ? 'unmark_contacted'
              : 'convert_to_client',
          formId: formId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        showSuccess(data.message)
        
        // Refresh form requests to show updated status
        await fetchFormRequests()
        // Optimistically hide converted form from list without waiting for filter UI
        if (action === 'convert_to_client') {
          setFormRequests(prev => prev.filter(fr => (fr.id || fr._id) !== formId))
        }
        
        // If converted to client, open Clients modal and highlight new client
        if (action === 'convert_to_client') {
          await fetchClients()
          if (data.clientId) {
            setHighlightClientId(data.clientId as string)
          }
          setShowFormModal(false)
          setShowClientsModal(true)
          // Auto-clear highlight after a few seconds
          setTimeout(() => setHighlightClientId(null), 6000)
        }
      } else {
        console.error(`❌ ${action} failed:`, data.error)
        // If client already exists, sync UI instead of only showing error
        if (action === 'convert_to_client' && String(data.error || '').toLowerCase().includes('already exists')) {
          await fetchFormRequests()
          await fetchClients()
          setShowFormModal(false)
          setShowClientsModal(true)
          showError('Client already exists for this request. Opened Clients list.')
        } else {
          showError(`Error: ${data.error}`)
        }
      }
    } catch (error) {
      console.error(`❌ Error in ${action}:`, error)
      showError(`Error: ${error}`)
    }
    setProcessingFormId(null)
  }

  const openEditClient = (client: Client) => {
    setEditClientData({
      clientId: client.id || client._id,
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'active',
      notes: client.notes || ''
    })
    setIsEditingClient(true)
  }

  const saveEditedClient = async () => {
    setIsSavingClient(true)
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_client',
          clientData: editClientData
        })
      })
      const data = await response.json()
      if (data.success) {
        showSuccess('Client updated successfully')
        setIsEditingClient(false)
        await fetchClients()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to update client')
    }
    setIsSavingClient(false)
  }

  const openAddProject = (client: Client) => {
    setProjectClientId(client.id || client._id)
    setProjectData({ 
      name: '', 
      description: '', 
      status: 'planning', 
      startDate: '', 
      endDate: '', 
      budget: '', 
      category: 'Website' 
    })
    setIsAddingProject(true)
  }

  const saveProject = async () => {
    setIsSavingProject(true)
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_project',
          clientData: { clientId: projectClientId },
          projectData: {
            name: projectData.name,
            description: projectData.description,
            status: projectData.status,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            budget: projectData.budget
          }
        })
      })
      const data = await response.json()
      if (data.success) {
        showSuccess('Project added successfully')
        setIsAddingProject(false)
        await fetchClients()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to add project')
    }
    setIsSavingProject(false)
  }

  const uploadImage = async (file: File, imageKey: keyof typeof content.images) => {
    try {
      setUploadingImage(imageKey)
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload-image', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Failed to upload image')
      const result = await response.json()
      updateImages({ [imageKey]: result.url })
      showSuccess('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      showError('Failed to upload image')
    } finally {
      setUploadingImage(null)
    }
  }

  const uploadResumePdf = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }

      const result = await response.json()

      updateHero({ resumePdfUrl: result.url })
      showSuccess('Resume uploaded successfully!')
    } catch (error) {
      console.error('Error uploading resume:', error)
      showError('Failed to upload resume')
    }
  }

  const deleteClient = async (clientId: string) => {
    const proceed = confirm('Are you sure you want to delete this client permanently?')
    if (!proceed) return
    setDeletingClientId(clientId)
    try {
      const resp = await fetch(`/api/clients?clientId=${clientId}`, { method: 'DELETE' })
      const data = await resp.json()
      if (data.success) {
        showSuccess('Client deleted successfully')
        await fetchClients()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to delete client')
    }
    setDeletingClientId(null)
  }

  // Fetch stats function (reusable)
  const fetchStats = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      
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
      // Prevent background page scrolling when admin panel is open
      // Use position: fixed on body to prevent background scroll
      const originalStyle = window.getComputedStyle(document.body).position
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
      
      // Store original scroll position
      const scrollY = window.scrollY
      
      return () => {
        // Restore original state when admin panel closes
        document.body.style.position = originalStyle
        document.body.style.width = ''
        document.body.style.top = ''
        window.scrollTo(0, scrollY)
      }
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

  useEffect(() => {
    if (activeTab === 'edit-projects') {
      fetchProjects()
      fetchCategories()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'manage-categories') {
      fetchCategories()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'add-projects') {
      fetchCategories()
    }
  }, [activeTab])

  useEffect(() => {
    if (categories.length > 0 && activeTab === 'add-projects') {
      setProjectData(v => ({ ...v, category: categories[0].name }))
    }
  }, [categories, activeTab])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'edit-homepage', name: 'Edit Homepage', icon: '🏠' },
    { id: 'add-projects', name: 'Add Project', icon: '➕' },
    { id: 'edit-projects', name: 'Edit Project', icon: '✏️' },
    { id: 'manage-categories', name: 'Manage Categories', icon: '🏷️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'logs', name: 'Logs', icon: '📝' },
  ]

  const uploadPersonalProjectImage = async (file: File) => {
   try {
     const formData = new FormData()
     formData.append('file', file)
     const response = await fetch('/api/projects/upload-image', { method: 'POST', body: formData })
     const text = await response.text()
     if (!response.ok) {
       showError(`Upload failed: ${text}`)
       return
     }
     let result: any
     try { result = JSON.parse(text) } catch { result = {} }
     if (!result.success) {
       showError(`Upload failed: ${result.error || 'Unknown error'}`)
       return
     }
     setProjectImage(result.url)
     showSuccess('Project image uploaded!')
   } catch (e) {
     console.error(e)
     showError('Failed to upload project image')
   }
 }

  const handleAddPersonalProject = async () => {
    try {
      const technologies = techInput.split(',').map(t => t.trim()).filter(Boolean)
      const payload = {
        title: projectData.name,
        description: projectData.description,
        technologies,
        link: projectLink,
        imageUrl: projectImage,
        category: projectData.category,
      }
      const resp = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await resp.json()
      if (!data.success) throw new Error(data.error || 'Create failed')
      showSuccess('Personal project added')
      // refresh edit list if user navigates there next
      await fetchProjects()
      setProjectData({ 
        name: '', 
        description: '', 
        status: 'planning', 
        startDate: '', 
        endDate: '', 
        budget: '', 
        category: categories.length > 0 ? categories[0].name : 'Website' 
      })
      setTechInput('')
      setProjectLink('')
      setProjectImage('')
    } catch (e) {
      console.error(e)
      showError('Failed to add project')
    }
  }

  const fetchProjects = async () => {
    setIsProjectsLoading(true)
    try {
      const res = await fetch('/api/projects')
      const json = await res.json()
      if (json.success) {
        setProjectsDB(json.data || [])
      } else {
        console.error('❌ Failed to load projects:', json.error)
      }
    } catch (e) {
      console.error('❌ Error fetching projects:', e)
    } finally {
      setIsProjectsLoading(false)
    }
  }

  const openEditProject = (p: any) => {
    setEditProject({
      _id: p._id,
      title: p.title || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      link: p.link || '',
      imageUrl: p.imageUrl || '',
      category: p.category || (categories.length > 0 ? categories[0].name : 'Website')
    })
    setEditProjectModalOpen(true)
  }

  const saveEditProject = async () => {
    try {
      const payload = {
        _id: editProject._id,
        title: editProject.title,
        description: editProject.description,
        technologies: editProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
        link: editProject.link,
        imageUrl: editProject.imageUrl,
        category: editProject.category,
      }
      const res = await fetch('/api/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Update failed')
      showSuccess('Project updated')
      setEditProjectModalOpen(false)
      await fetchProjects()
    } catch (e) {
      console.error('❌ Error updating project:', e)
      showError('Failed to update project')
    }
  }

  const deleteProject = async (id: string) => {
    const ok = confirm('Delete this project?')
    if (!ok) return
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Delete failed')
      showSuccess('Project deleted')
      await fetchProjects()
    } catch (e) {
      console.error('❌ Error deleting project:', e)
      showError('Failed to delete project')
    }
  }

  const uploadEditProjectImage = async (file: File) => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/projects/upload-image', { method: 'POST', body: fd })
      const text = await res.text()
      if (!res.ok) { showError(`Upload failed: ${text}`); return }
      const data = JSON.parse(text)
      setEditProject(v => ({ ...v, imageUrl: data.url }))
      showSuccess('Image uploaded!')
    } catch (e) {
      console.error(e)
      showError('Failed to upload image')
    }
  }

  // Category Management Functions
  const fetchCategories = async () => {
    setIsCategoriesLoading(true)
    try {
      const res = await fetch('/api/categories')
      const json = await res.json()
      if (json.success) {
        setCategories(json.data || [])
      } else {
        console.error('❌ Failed to load categories:', json.error)
      }
    } catch (e) {
      console.error('❌ Error fetching categories:', e)
    } finally {
      setIsCategoriesLoading(false)
    }
  }

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })
      const data = await response.json()
      if (data.success) {
        showSuccess('Category added successfully!')
        setShowAddCategoryModal(false)
        setNewCategory({ name: '', color: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30' })
        await fetchCategories()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to add category')
    }
  }

  const handleEditCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      })
      const data = await response.json()
      if (data.success) {
        showSuccess('Category updated successfully!')
        setShowEditCategoryModal(false)
        setEditingCategory(null)
        await fetchCategories()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const proceed = confirm('Are you sure you want to delete this category?')
    if (!proceed) return
    
    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        showSuccess('Category deleted successfully!')
        await fetchCategories()
      } else {
        showError(`Error: ${data.error}`)
      }
    } catch (e) {
      showError('Failed to delete category')
    }
  }

  const openEditCategory = (category: any) => {
    setEditingCategory(category)
    setShowEditCategoryModal(true)
  }

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
              className="w-full max-w-7xl h-[90vh] bg-neutral-50 dark:bg-neutral-800 rounded-[24px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  {/* Mobile: Sidebar toggle */}
                  <button
                    aria-label="Toggle menu"
                    className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsSidebarOpen((v) => !v)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 bg-primary rounded-[16px] flex items-center justify-center shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">Nishant Mogahaa</h1>
                    <p className="text-xs md:text-sm text-muted-foreground">Welcome back ❤️</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={closeAdminPanel}
                    className="px-3 md:px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-[16px] transition-colors flex items-center space-x-2 shadow-xs"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
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

              <div className="flex-1 min-h-0 flex flex-col md:flex-row">
                {/* Sidebar */}
                {/* Desktop sidebar */}
                <div className="hidden md:block w-64 shrink-0 bg-neutral-50 dark:bg-neutral-800 p-4 border-r border-border">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false) }}
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

                {/* Mobile sidebar (off-canvas) */}
                {isSidebarOpen && (
                  <>
                    <div
                      className="md:hidden fixed inset-0 z-[150] bg-black/40"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="md:hidden fixed left-0 top-0 bottom-0 z-[160] w-72 max-w-[85vw] bg-neutral-50 dark:bg-neutral-800 p-4 border-r border-border shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground">Menu</span>
                        <button
                          aria-label="Close menu"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <nav className="space-y-2">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false) }}
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
                  </>
                )}

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6 admin-panel-content">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6 h-full overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500 dark:[&::-webkit-scrollbar-track]:bg-gray-800 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-thumb]:hover:bg-gray-700"
                    >
                      {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h2>
                            <div className="flex items-center gap-2 md:gap-3">
                              {lastRefresh && (
                                <span className="text-xs text-muted-foreground">
                                  Last updated: {lastRefresh.toLocaleTimeString()}
                                </span>
                              )}
                              <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
                              >
                                <span className={`${isRefreshing ? 'animate-spin' : ''}`}>
                                  🔄
                                </span>
                                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                              </button>
                            </div>
                          </div>
                          
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-[24px] p-4 md:p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)] border border-border">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

                      {activeTab === 'edit-homepage' && (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Edit Homepage</h2>
                            {hasUnsavedChanges && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                ⚠️ Unsaved Changes
                              </Badge>
                            )}
                          </div>
                          
                          {/* Edit Hero Section */}
                          <div className="space-y-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Edit Hero Section</h3>
                                <p className="text-sm text-muted-foreground">Update the main hero content of your homepage</p>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-foreground">Main Title</label>
                                  <Input 
                                    value={content?.hero?.title || ''}
                                    onChange={(e) => updateHero({ title: e.target.value })}
                                    placeholder="Enter main title" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Subtitle</label>
                                  <Input 
                                    value={content?.hero?.subtitle || ''}
                                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                                    placeholder="Enter subtitle" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Description</label>
                                  <Textarea 
                                    value={content?.hero?.description || ''}
                                    onChange={(e) => updateHero({ description: e.target.value })}
                                    placeholder="Enter description" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Top Button Text</label>
                                  <Input 
                                    value={content?.hero?.founderText || ''}
                                    onChange={(e) => updateHero({ founderText: e.target.value })}
                                    placeholder="Enter founder text" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">2nd Button Text</label>
                                  <Input 
                                    value={content?.hero?.resumeButtonText || ''}
                                    onChange={(e) => updateHero({ resumeButtonText: e.target.value })}
                                    placeholder="Enter resume button text" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Upload Resume (PDF)</label>
                                  <div className="flex gap-2 mt-1">
                                    <Input 
                                      value={content?.hero?.resumePdfUrl || ''}
                                      onChange={(e) => updateHero({ resumePdfUrl: e.target.value })}
                                      placeholder="Enter resume PDF URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      id="resumePdfInput"
                                      className="hidden"
                                      accept="application/pdf"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          await uploadResumePdf(file)
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => document.getElementById('resumePdfInput')?.click()}
                                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                                    >
                                      Upload
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Role Text</label>
                                  <Input 
                                    value={content?.hero?.roleText || ''}
                                    onChange={(e) => updateHero({ roleText: e.target.value })}
                                    placeholder="Enter role text" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Role Highlight</label>
                                  <Input 
                                    value={content?.hero?.roleHighlight || ''}
                                    onChange={(e) => updateHero({ roleHighlight: e.target.value })}
                                    placeholder="Enter role highlight" 
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Manage Images */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Manage Images</h3>
                                <p className="text-sm text-muted-foreground">Update or replace homepage images</p>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-foreground">Main Title Image</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.lionImage || ''}
                                    onChange={(e) => updateImages({ lionImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'lionImage')
                                      }}
                                      className="hidden"
                                      id="lionImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('lionImage-upload')?.click()}
                                      disabled={uploadingImage === 'lionImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'lionImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Subtitle Image</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.memogiImage || ''}
                                    onChange={(e) => updateImages({ memogiImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'memogiImage')
                                      }}
                                      className="hidden"
                                      id="memogiImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('memogiImage-upload')?.click()}
                                      disabled={uploadingImage === 'memogiImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'memogiImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Left BG Image (Dark)</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.nishantImage || ''}
                                    onChange={(e) => updateImages({ nishantImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'nishantImage')
                                      }}
                                      className="hidden"
                                      id="nishantImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('nishantImage-upload')?.click()}
                                      disabled={uploadingImage === 'nishantImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'nishantImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Right BG Image (Dark)</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.mogahaaImage || ''}
                                    onChange={(e) => updateImages({ mogahaaImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'mogahaaImage')
                                      }}
                                      className="hidden"
                                      id="mogahaaImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('mogahaaImage-upload')?.click()}
                                      disabled={uploadingImage === 'mogahaaImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'mogahaaImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Left BG Image (Light)</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.nishantLightImage || ''}
                                    onChange={(e) => updateImages({ nishantLightImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'nishantLightImage')
                                      }}
                                      className="hidden"
                                      id="nishantLightImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('nishantLightImage-upload')?.click()}
                                      disabled={uploadingImage === 'nishantLightImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'nishantLightImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Right BG Image (Light)</label>
                                  <div className="flex gap-2 mt-1">
                                  <Input 
                                      value={content?.images?.mogahaaLightImage || ''}
                                    onChange={(e) => updateImages({ mogahaaLightImage: e.target.value })}
                                    placeholder="Enter image URL" 
                                      className="flex-1"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) uploadImage(file, 'mogahaaLightImage')
                                      }}
                                      className="hidden"
                                      id="mogahaaLightImage-upload"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => document.getElementById('mogahaaLightImage-upload')?.click()}
                                      disabled={uploadingImage === 'mogahaaLightImage'}
                                      className="px-3"
                                    >
                                      {uploadingImage === 'mogahaaLightImage' ? 'Uploading...' : 'Upload'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* SEO Settings */}
                            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">SEO Settings</h3>
                                <p className="text-sm text-muted-foreground">Manage meta tags and SEO optimization</p>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-foreground">Page Title</label>
                                  <Input 
                                    value={content?.seo?.title || ''}
                                    onChange={(e) => updateSEO({ title: e.target.value })}
                                    placeholder="Enter page title" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Meta Description</label>
                                  <Textarea 
                                    value={content?.seo?.description || ''}
                                    onChange={(e) => updateSEO({ description: e.target.value })}
                                    placeholder="Enter meta description" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Keywords</label>
                                  <Textarea 
                                    value={content?.seo?.keywords?.join(', ') || ''}
                                    onChange={(e) => updateSEO({ keywords: e.target.value.split(',').map(k => k.trim()) })}
                                    placeholder="Enter keywords (comma separated)" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Author</label>
                                  <Input 
                                    value={content?.seo?.author || ''}
                                    onChange={(e) => updateSEO({ author: e.target.value })}
                                    placeholder="Enter author name" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Open Graph Title</label>
                                  <Input 
                                    value={content?.seo?.ogTitle || ''}
                                    onChange={(e) => updateSEO({ ogTitle: e.target.value })}
                                    placeholder="Enter Open Graph title" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Open Graph Description</label>
                                  <Textarea 
                                    value={content?.seo?.ogDescription || ''}
                                    onChange={(e) => updateSEO({ ogDescription: e.target.value })}
                                    placeholder="Enter Open Graph description" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Twitter Title</label>
                                  <Input 
                                    value={content?.seo?.twitterTitle || ''}
                                    onChange={(e) => updateSEO({ twitterTitle: e.target.value })}
                                    placeholder="Enter Twitter title" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Twitter Description</label>
                                  <Textarea 
                                    value={content?.seo?.twitterDescription || ''}
                                    onChange={(e) => updateSEO({ twitterDescription: e.target.value })}
                                    placeholder="Enter Twitter description" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Canonical URL</label>
                                  <Input 
                                    value={content?.seo?.canonicalUrl || ''}
                                    onChange={(e) => updateSEO({ canonicalUrl: e.target.value })}
                                    placeholder="Enter canonical URL" 
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                              <Button 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await saveChanges()
                                    showSuccess('Homepage changes saved successfully!')
                                  } catch (error) {
                                    showError('Failed to save changes')
                                  }
                                }}
                                disabled={!hasUnsavedChanges}
                              >
                                💾 Save Changes
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  // Preview functionality can be added here
                                  showSuccess('Preview mode - changes are visible in real-time!')
                                }}
                              >
                                👁️ Preview Changes
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  resetToDefault()
                                  showSuccess('Reset to default values')
                                }}
                              >
                                🔄 Reset to Default
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'add-projects' && (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Add Project</h2>
                            {hasUnsavedChanges && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                ⚠️ Unsaved Changes
                              </Badge>
                            )}
                          </div>
                          
                          {/* Add Project Form */}
                          <div className="space-y-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
                                <p className="text-sm text-muted-foreground">Enter the project details</p>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-foreground">Project Image</label>
                                  <div className="flex gap-2 mt-1">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                        {projectImage ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img src={projectImage} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-xs text-muted-foreground">No image</span>
                                        )}
                                      </div>
                                      <Input value={projectImage} onChange={e => setProjectImage(e.target.value)} placeholder="Image URL" className="flex-1" />
                                      <input type="file" id="personalProjectImage" className="hidden" accept="image/*" onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          await uploadPersonalProjectImage(file)
                                        }
                                      }} />
                                      <Button type="button" onClick={() => document.getElementById('personalProjectImage')?.click()} className="px-4">Upload</Button>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Project Title</label>
                                  <Input 
                                    value={projectData.name}
                                    onChange={(e) => setProjectData(v => ({ ...v, name: e.target.value }))}
                                    placeholder="Enter project title" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Project Description</label>
                                  <Textarea 
                                    value={projectData.description}
                                    onChange={(e) => setProjectData(v => ({ ...v, description: e.target.value }))}
                                    placeholder="Enter project description" 
                                    className="mt-1"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Technologies (comma separated)</label>
                                  <Input 
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    placeholder="React, Next.js, Tailwind" 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Project Link</label>
                                  <Input 
                                    value={projectLink}
                                    onChange={(e) => setProjectLink(e.target.value)}
                                    placeholder="https://..." 
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Project Category</label>
                                  <select
                                    value={projectData.category}
                                    onChange={(e) => setProjectData(v => ({ ...v, category: e.target.value }))}
                                    className="w-full px-3 py-2 mt-1 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                                    style={{ 
                                      direction: 'rtl',
                                      transform: 'scaleY(-1)'
                                    }}
                                  >
                                    {categories.map((cat) => (
                                      <option key={cat._id} value={cat.name} style={{ 
                                        direction: 'ltr',
                                        transform: 'scaleY(-1)'
                                      }}>{cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                              <Button 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleAddPersonalProject}
                                disabled={!projectData.name || !projectImage}
                              >
                                Add Project
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => { 
                                  setProjectData({ 
                                    name: '', 
                                    description: '', 
                                    status: 'planning', 
                                    startDate: '', 
                                    endDate: '', 
                                    budget: '', 
                                    category: categories.length > 0 ? categories[0].name : 'Website' 
                                  }); 
                                  setTechInput(''); 
                                  setProjectLink(''); 
                                  setProjectImage(''); 
                                }}
                              >
                                Reset
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'edit-projects' && (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Edit Project</h2>
                            {hasUnsavedChanges && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                ⚠️ Unsaved Changes
                              </Badge>
                            )}
                          </div>
                          
                          {/* Projects List */}
                          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                            {isProjectsLoading ? (
                              <p className="text-sm text-muted-foreground">Loading projects…</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                {projectsDB.map((p) => (
                                  <MinimalCard
                                    key={String(p._id)}
                                    className="w-full transform transition-all duration-300 hover:scale-[1.02]"
                                  >
                                                                         <MinimalCardImage className="h-[200px] sm:h-[280px] lg:h-[320px]" src={p.imageUrl} alt={p.title} />
                                    <MinimalCardTitle>{p.title}</MinimalCardTitle>
                                                                         <MinimalCardDescription className="line-clamp-3">
                                       {p.description}
                                     </MinimalCardDescription>
+                                    <div className="px-1 mt-2">
+                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
+                                        📁 {p.category || 'Website'}
+                                      </span>
+                                    </div>
                                    <div className="flex flex-wrap gap-2 px-1 mt-3">
                                      {(Array.isArray(p.technologies) ? p.technologies : []).map((tech: string, i: number) => {
                                        const colors = [
                                          'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30',
                                          'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30',
                                          'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30',
                                          'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30',
                                          'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30',
                                          'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30',
                                          'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30',
                                          'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30',
                                          'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30',
                                          'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300/30'
                                        ];
                                        const colorClass = colors[i % colors.length];
                                        return (
                                          <span 
                                            key={i} 
                                            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${colorClass} transition-all duration-200 hover:scale-105 hover:shadow-sm`}
                                          >
                                            {tech}
                                          </span>
                                        );
                                      })}
                                    </div>
                                    <div className="px-1 mt-4 flex gap-2">
                                      <button className="relative w-full h-9 bg-gradient-to-r from-black/10 dark:from-white/10 to-black/5 dark:to-white/5 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-[12px] cursor-pointer transition-all duration-300 hover:from-black/20 dark:hover:from-white/20 hover:to-black/10 dark:hover:to-white/10"
                                        onClick={() => openEditProject(p)}
                                      >
                                        <span className="text-sm font-medium text-black dark:text-white">Edit</span>
                                      </button>
                                      <button className="relative w-full h-9 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-[12px] cursor-pointer transition-all duration-300 hover:bg-red-500/20 text-red-700 dark:text-red-300"
                                        onClick={() => deleteProject(String(p._id))}
                                      >
                                        <span className="text-sm font-medium">Delete</span>
                                      </button>
                                      {p.link && (
                                        <a href={p.link} target="_blank" rel="noreferrer" className="relative w-full h-9 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-[12px] cursor-pointer transition-all duration-300 hover:bg-blue-500/20 flex items-center justify-center">
                                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Visit</span>
                                        </a>
                                      )}
                                    </div>
                                  </MinimalCard>
                                ))}
                                {projectsDB.length === 0 && (
                                  <div className="col-span-full text-sm text-muted-foreground">No projects found.</div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Edit Project Modal */}
                          <AnimatePresence>
                            {editProjectModalOpen && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4">
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md p-5 relative">
                                  <button aria-label="Close" className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground" onClick={() => setEditProjectModalOpen(false)}>✕</button>
                                  <h3 className="text-lg font-semibold text-foreground mb-4">Edit Project</h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        {editProject.imageUrl ? <img src={editProject.imageUrl} alt="preview" className="w-full h-full object-cover" /> : <span className="text-xs text-muted-foreground">No image</span>}
                                      </div>
                                      <input className="flex-1 px-3 py-2 text-sm border rounded" placeholder="Image URL" value={editProject.imageUrl} onChange={e => setEditProject(v => ({ ...v, imageUrl: e.target.value }))} />
                                      <input type="file" id="editProjectImage" className="hidden" accept="image/*" onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) await uploadEditProjectImage(file)
                                      }} />
                                      <button className="px-3 py-2 text-sm rounded border" onClick={() => document.getElementById('editProjectImage')?.click()}>Upload</button>
                                    </div>
                                    <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Title" value={editProject.title} onChange={e => setEditProject(v => ({ ...v, title: e.target.value }))} />
                                    <textarea className="w-full px-3 py-2 text-sm border rounded" placeholder="Description" rows={3} value={editProject.description} onChange={e => setEditProject(v => ({ ...v, description: e.target.value }))} />
                                    <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Technologies (comma separated)" value={editProject.technologies} onChange={e => setEditProject(v => ({ ...v, technologies: e.target.value }))} />
                                    <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Link" value={editProject.link} onChange={e => setEditProject(v => ({ ...v, link: e.target.value }))} />
                                    <select className="w-full px-3 py-2 text-sm border rounded" value={editProject.category} onChange={e => setEditProject(v => ({ ...v, category: e.target.value }))} style={{ 
                                      direction: 'rtl',
                                      transform: 'scaleY(-1)'
                                    }}>
                                      {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name} style={{ 
                                          direction: 'ltr',
                                          transform: 'scaleY(-1)'
                                        }}>{cat.name}</option>
                                      ))}
                                    </select>
                                    <div className="flex justify-end gap-2">
                                      <button className="px-3 py-2 text-sm rounded border" onClick={() => setEditProjectModalOpen(false)}>Cancel</button>
                                      <button className="px-3 py-2 text-sm rounded bg-green-600 text-white" onClick={saveEditProject}>Save</button>
                                    </div>
                                  </div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {activeTab === 'manage-categories' && (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Manage Categories</h2>
                            <button
                              onClick={() => setShowAddCategoryModal(true)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                              ➕ Add Category
                            </button>
                          </div>
                          
                          {/* Categories List */}
                          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border p-6">
                            {isCategoriesLoading ? (
                              <p className="text-sm text-muted-foreground">Loading categories…</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                {categories.map((category) => (
                                  <div
                                    key={String(category._id)}
                                    className="border border-border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${category.color}`}>
                                        {category.name}
                                      </span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => openEditCategory(category)}
                                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                        >
                                          ✏️ Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCategory(String(category._id))}
                                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                        >
                                          🗑️ Delete
                                        </button>
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Created: {new Date(category.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                ))}
                                {categories.length === 0 && (
                                  <div className="col-span-full text-sm text-muted-foreground">No categories found.</div>
                                )}
                              </div>
                            )}
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
      
      {/* Edit Client Modal */}
      <AnimatePresence>
        {isEditingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md p-5 relative"
            >
              <button
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsEditingClient(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-foreground mb-4">Edit Client</h3>
              <div className="space-y-3">
                <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Name" value={editClientData.name} onChange={e => setEditClientData(v => ({ ...v, name: e.target.value }))} />
                <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Email" value={editClientData.email} onChange={e => setEditClientData(v => ({ ...v, email: e.target.value }))} />
                <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Phone" value={editClientData.phone} onChange={e => setEditClientData(v => ({ ...v, phone: e.target.value }))} />
                <select className="w-full px-3 py-2 text-sm border rounded" value={editClientData.status} onChange={e => setEditClientData(v => ({ ...v, status: e.target.value }))} style={{ 
                  direction: 'rtl',
                  transform: 'scaleY(-1)'
                }}>
                  <option value="active" style={{ 
                    direction: 'ltr',
                    transform: 'scaleY(-1)'
                  }}>Active</option>
                  <option value="inactive" style={{ 
                    direction: 'ltr',
                    transform: 'scaleY(-1)'
                  }}>Inactive</option>
                </select>
                <textarea className="w-full px-3 py-2 text-sm border rounded" placeholder="Notes" rows={3} value={editClientData.notes} onChange={e => setEditClientData(v => ({ ...v, notes: e.target.value }))} />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded border" onClick={() => setIsEditingClient(false)}>Cancel</button>
                <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white disabled:opacity-50" disabled={isSavingClient} onClick={saveEditedClient}>
                  {isSavingClient ? 'Saving…' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md p-5 relative"
            >
              <button
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsAddingProject(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-foreground mb-4">Add Project</h3>
              <div className="space-y-3">
                <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Project title" value={projectData.name} onChange={e => setProjectData(v => ({ ...v, name: e.target.value }))} />
                <textarea className="w-full px-3 py-2 text-sm border rounded" placeholder="Project description" rows={3} value={projectData.description} onChange={e => setProjectData(v => ({ ...v, description: e.target.value }))} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input className="w-full px-3 py-2 text-sm border rounded" type="date" placeholder="Start date" value={projectData.startDate} onChange={e => setProjectData(v => ({ ...v, startDate: e.target.value }))} />
                  <input className="w-full px-3 py-2 text-sm border rounded" type="date" placeholder="End date" value={projectData.endDate} onChange={e => setProjectData(v => ({ ...v, endDate: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select className="w-full px-3 py-2 text-sm border rounded" value={projectData.status} onChange={e => setProjectData(v => ({ ...v, status: e.target.value }))} style={{ 
                    direction: 'rtl',
                    transform: 'scaleY(-1)'
                  }}>
                    <option value="planning" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Planning</option>
                    <option value="in_progress" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>In Progress</option>
                    <option value="completed" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Completed</option>
                  </select>
                  <input className="w-full px-3 py-2 text-sm border rounded" placeholder="Budget (price)" value={projectData.budget} onChange={e => setProjectData(v => ({ ...v, budget: e.target.value }))} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-2 text-sm rounded border" onClick={() => setIsAddingProject(false)}>Cancel</button>
                <button className="px-3 py-2 text-sm rounded bg-green-600 text-white disabled:opacity-50" disabled={isSavingProject} onClick={saveProject}>
                  {isSavingProject ? 'Saving…' : 'Add Project'}
                </button>
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
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-4xl md:max-w-5xl max-h-[90vh] overflow-hidden p-4 md:p-6 relative"
            >
              <button
                aria-label="Close"
                title="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 dark:bg-neutral-800/80 text-gray-600 dark:text-gray-300 shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors duration-200 hover:bg-white hover:text-gray-900 dark:hover:bg-neutral-800 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setShowFormModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">Contact Form Requests</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground hidden sm:block">
                      Showing {filteredFormRequests.length} of {formRequests.length}
                    </div>
                    <button
                      onClick={fetchFormRequests}
                      disabled={isFormLoading}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded transition-colors"
                    >
                      <span className={`${isFormLoading ? 'animate-spin' : ''}`}>🔄</span>
                      {isFormLoading ? 'Loading...' : 'Refresh'}
                    </button>
                    <button
                      onClick={exportFilteredFormsToCsv}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      ⬇️ Export CSV
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <input
                    value={formSearch}
                    onChange={(e) => setFormSearch(e.target.value)}
                    placeholder="Search name, email, phone or message..."
                    className="w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'all' | 'new' | 'contacted' | 'converted')}
                    className="w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    style={{ 
                      direction: 'rtl',
                      transform: 'scaleY(-1)'
                    }}
                  >
                    <option value="all" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>All statuses</option>
                    <option value="new" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>New</option>
                    <option value="contacted" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Contacted</option>
                    <option value="converted" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Converted to Client</option>
                  </select>
                  <select
                    value={formSort}
                    onChange={(e) => setFormSort(e.target.value as 'newest' | 'oldest')}
                    className="w-full px-3 py-2 text-sm border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    style={{ 
                      direction: 'rtl',
                      transform: 'scaleY(-1)'
                    }}
                  >
                    <option value="newest" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Newest first</option>
                    <option value="oldest" style={{ 
                      direction: 'ltr',
                      transform: 'scaleY(-1)'
                    }}>Oldest first</option>
                  </select>
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
                  {filteredFormRequests.map((req, idx) => (
                    <div key={`form-request-${req._id || req.id || idx}`} className="border border-border rounded-xl p-5 bg-neutral-50/60 dark:bg-neutral-800/60 hover:bg-neutral-100/70 dark:hover:bg-neutral-700/70 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                            {(req.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-base">{req.name || 'N/A'}</span>
                              <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-neutral-200">{req.ip || 'Unknown IP'}</span>
                              {req.status && (
                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] rounded-full font-medium ${
                                  req.status === 'contacted' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : req.status === 'converted_to_client'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {req.status === 'contacted' ? 'Contacted' : 
                                   req.status === 'converted_to_client' ? 'Client' : 
                                   'New'}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{new Date(req.timestamp || req.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📧 Email:</span>
                          <a href={`mailto:${req.email}`} className="text-blue-600 hover:text-blue-800 underline flex-1 truncate">{req.email}</a>
                          <button onClick={() => copyToClipboard(req.email, 'Email')} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">Copy</button>
                          <a href={`mailto:${req.email}?subject=Re: Contact from Portfolio&body=Hi ${req.name},%0D%0A%0D%0AThank you for contacting me through my portfolio.%0D%0A%0D%0ABest regards,%0D%0ANishant`} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">Reply</a>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border">
                          <span className="text-sm font-medium">📞 Phone:</span>
                          <span className="flex-1">{req.phone || 'N/A'}</span>
                          {req.phone && (
                            <>
                              <button onClick={() => copyToClipboard(req.phone!, 'Phone')} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">Copy</button>
                              <a href={`tel:${req.phone}`} className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">Call</a>
                            </>
                          )}
                        </div>
                      </div>

                      {req.preferredTime && (
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-neutral-900 rounded border mb-3">
                          <span className="text-sm font-medium">⏰ Preferred Time:</span>
                          <span className="text-sm">{req.preferredTime}</span>
                        </div>
                      )}

                      <details className="rounded border bg-white dark:bg-neutral-900">
                        <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-2 p-3">
                          <span className="flex items-center gap-2 text-sm font-medium">💬 Message</span>
                          <span className="text-xs text-muted-foreground">Click to {`expand`}</span>
                        </summary>
                        <div className="px-3 pb-3">
                          <div className="text-sm text-muted-foreground whitespace-pre-line bg-gray-50 dark:bg-neutral-800 p-2 rounded max-h-40 overflow-y-auto">
                            {req.message || 'No message provided'}
                          </div>
                        </div>
                      </details>

                      <div className="mt-4 flex gap-2 flex-wrap">
                        {req.status === 'contacted' ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium bg-blue-100 text-blue-800">
                              📞 Contacted
                            </span>
                            <button
                              onClick={() => handleFormAction(req.id || req._id, 'unmark_contacted')}
                              disabled={processingFormId === (req.id || req._id)}
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                              title="Undo contacted"
                            >
                              ✖️ Unmark
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleFormAction(req.id || req._id, 'contacted')}
                            disabled={processingFormId === (req.id || req._id) || req.status === 'converted_to_client'}
                            className={`inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                              req.status === 'converted_to_client'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            {processingFormId === (req.id || req._id) ? '⏳ Processing...' : '📞 Mark as Contacted'}
                          </button>
                        )}

                        <button
                          onClick={() => handleFormAction(req.id || req._id, 'convert_to_client')}
                          disabled={processingFormId === (req.id || req._id) || req.status === 'converted_to_client'}
                          className={`inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                            req.status === 'converted_to_client'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {processingFormId === (req.id || req._id) ? '⏳ Processing...' : '👤 Convert to Client'}
                        </button>
                      </div>

                      {req.userAgent && (
                        <details className="mt-3">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">🔍 Technical Details</summary>
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
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-hidden p-4 md:p-6 relative"
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
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-3xl md:max-w-6xl max-h-[90vh] overflow-hidden p-4 md:p-6 relative"
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
                    Active: {clients.length} clients
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
                    <div
                      key={`client-${client._id || client.id || idx}`}
                      className={`border border-border rounded-lg p-6 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                        highlightClientId && (client.id === highlightClientId || client._id === highlightClientId)
                          ? 'ring-2 ring-green-500'
                          : ''
                      }`}
                    >
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
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {client.projects.map((project: Project, projectIdx: number) => {
                              const isOverdue = project.endDate && new Date(project.endDate).getTime() < Date.now()
                              return (
                                <div key={`project-${project.id || projectIdx}`} className={`p-2 bg-white dark:bg-neutral-900 rounded border text-sm space-y-1 ${isOverdue ? 'border-yellow-400' : ''}`}>
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium break-words">{project.name}</span>
                                      <span className="text-muted-foreground ml-2">({project.status})</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                      {project.budget && `${project.budget}`}
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground break-words">{project.description}</div>
                                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>Start: {project.startDate || '-'}</span>
                                    <span>End: {project.endDate || '-'}</span>
                                  </div>
                                  {isOverdue && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <button
                                        className="px-2 py-1 text-[11px] rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                        onClick={() => {
                                          openAddProject(client as Client)
                                          setProjectData(v => ({ ...v, name: project.name, description: project.description || '', status: project.status || 'planning', startDate: project.startDate || '', endDate: '', budget: String(project.budget || '') }))
                                        }}
                                        title="Extend date"
                                      >
                                        ⏳ Extend Date
                                      </button>
                                      <button
                                        className="px-2 py-1 text-[11px] rounded bg-red-100 text-red-800 hover:bg-red-200"
                                        onClick={async () => {
                                          const extend = confirm('Project end date passed. Do you want to delete this project? (Cancel to keep)')
                                          if (!extend) return
                                          try {
                                            const resp = await fetch('/api/clients', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({
                                                action: 'update_project',
                                                clientData: { clientId: client.id || client._id },
                                                projectData: { projectId: project.id, status: 'completed', endDate: new Date().toISOString().split('T')[0] }
                                              })
                                            })
                                            const data = await resp.json()
                                            if (data.success) {
                                              showSuccess('Project marked completed')
                                              await fetchClients()
                                            } else {
                                              showError(`Error: ${data.error}`)
                                            }
                                          } catch (e) {
                                            showError('Failed to update project')
                                          }
                                        }}
                                        title="Mark completed/delete"
                                      >
                                        ✅ Mark Completed
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
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
                        <button className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors" onClick={() => window.open(`mailto:${client.email}`)}>
                          📧 Send Email
                        </button>
                        <button className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors" onClick={() => openAddProject(client)}>
                          📁 Add Project
                        </button>
                        <button className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors" onClick={() => openEditClient(client)}>
                          ✏️ Edit Client
                        </button>
                        <button
                          className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                          onClick={() => deleteClient(client.id || client._id)}
                          disabled={deletingClientId === (client.id || client._id)}
                        >
                          {deletingClientId === (client.id || client._id) ? 'Deleting…' : '🗑️ Delete'}
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

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md p-5 relative"
            >
              <button
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                onClick={() => setShowAddCategoryModal(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold text-foreground mb-4">Add New Category</h3>
              <div className="space-y-3">
                <input
                  className="w-full px-3 py-2 text-sm border rounded"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={e => setNewCategory(v => ({ ...v, name: e.target.value }))}
                />
                
                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category Color</label>
                  
                  {/* Preset Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Blue', value: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30' },
                      { name: 'Green', value: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30' },
                      { name: 'Purple', value: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30' },
                      { name: 'Orange', value: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30' },
                      { name: 'Pink', value: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30' },
                      { name: 'Indigo', value: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30' },
                      { name: 'Red', value: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30' },
                      { name: 'Teal', value: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30' },
                      { name: 'Yellow', value: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30' },
                      { name: 'Cyan', value: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300/30' },
                      { name: 'Gray', value: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30' }
                    ].map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setNewCategory(v => ({ ...v, color: color.value }))}
                        className={`p-2 rounded border transition-all ${
                          newCategory.color === color.value 
                            ? 'ring-2 ring-blue-500 border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${color.value}`}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Color Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Custom color (hex: #FF0000 or rgb: rgb(255,0,0))"
                      className="flex-1 px-3 py-2 text-sm border rounded"
                      onChange={(e) => {
                        const colorValue = e.target.value
                        if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
                          // Convert to Tailwind-like classes
                          const customColor = `bg-[${colorValue}] text-white border-[${colorValue}]`
                          setNewCategory(v => ({ ...v, color: customColor }))
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      onClick={() => {
                        // Generate a random color
                        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
                        const randomColor = colors[Math.floor(Math.random() * colors.length)]
                        const customColor = `bg-[${randomColor}] text-white border-[${randomColor}]`
                        setNewCategory(v => ({ ...v, color: customColor }))
                      }}
                    >
                      🎨 Random
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-2 text-sm rounded border"
                    onClick={() => setShowAddCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-2 text-sm rounded bg-green-600 text-white disabled:opacity-50"
                    disabled={!newCategory.name.trim()}
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditCategoryModal && editingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full max-w-md p-5 relative"
            >
              <button
                aria-label="Close"
                className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                onClick={() => setShowEditCategoryModal(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold text-foreground mb-4">Edit Category</h3>
              <div className="space-y-3">
                <input
                  className="w-full px-3 py-2 text-sm border rounded"
                  placeholder="Category name"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory(v => ({ ...v, name: e.target.value }))}
                />
                
                {/* Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category Color</label>
                  
                  {/* Preset Colors */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Blue', value: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30' },
                      { name: 'Green', value: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30' },
                      { name: 'Purple', value: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30' },
                      { name: 'Orange', value: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30' },
                      { name: 'Pink', value: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30' },
                      { name: 'Indigo', value: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30' },
                      { name: 'Red', value: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-300/30' },
                      { name: 'Teal', value: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30' },
                      { name: 'Yellow', value: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300/30' },
                      { name: 'Cyan', value: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300/30' },
                      { name: 'Gray', value: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30' }
                    ].map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setEditingCategory(v => ({ ...v, color: color.value }))}
                        className={`p-2 rounded border transition-all ${
                          editingCategory.color === color.value 
                            ? 'ring-2 ring-blue-500 border-blue-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${color.value}`}>
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Color Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Custom color (hex: #FF0000 or rgb: rgb(255,0,0))"
                      className="flex-1 px-3 py-2 text-sm border rounded"
                      onChange={(e) => {
                        const colorValue = e.target.value
                        if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) {
                          // Convert to Tailwind-like classes
                          const customColor = `bg-[${colorValue}] text-white border-[${colorValue}]`
                          setEditingCategory(v => ({ ...v, color: customColor }))
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      onClick={() => {
                        // Generate a random color
                        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
                        const randomColor = colors[Math.floor(Math.random() * colors.length)]
                        const customColor = `bg-[${randomColor}] text-white border-[${randomColor}]`
                        setEditingCategory(v => ({ ...v, color: customColor }))
                      }}
                    >
                      🎨 Random
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-2 text-sm rounded border"
                    onClick={() => setShowEditCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-2 text-sm rounded bg-blue-600 text-white disabled:opacity-50"
                    disabled={!editingCategory.name.trim()}
                    onClick={handleEditCategory}
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminPanel