import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Type definitions - ADD THESE
interface Project {
  id: string
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
  budget: number
  createdAt: string
}

interface ClientDocument {
  _id: ObjectId
  id: string
  name: string
  email: string
  phone: string
  status: string
  projects: Project[]
  createdAt: string
  lastContact: string
  notes: string
  originalFormId?: string
}

interface VisitorDocument {
  _id: ObjectId
  timestamp: string
  ip: string
  userAgent: string
  referer: string
  location: string
  device: string
  browser: string
}

interface FormDocument {
  _id: ObjectId
  id: string
  name: string
  email: string
  phone: string
  message: string
  preferredTime?: string
  timestamp: string
  status?: string
  ip: string
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const VISITORS_COLLECTION = 'visitors'
const FORMS_COLLECTION = 'forms'
const CLIENTS_COLLECTION = 'clients'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper function to convert data to CSV format
const convertToCSV = (data: Record<string, unknown>[], headers: string[]) => {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || ''
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )
  return [csvHeaders, ...csvRows].join('\n')
}

// GET endpoint to export all data as Excel-compatible CSV
export async function GET(request: NextRequest) {
  try {
    console.log('📊 Starting Excel export...')
    
    const db = await getDb()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let exportData = ''
    let filename = 'portfolio_data.csv'

    if (type === 'visitors' || type === 'all') {
      console.log('👥 Exporting visitors...')
      const visitors = await db.collection<VisitorDocument>(VISITORS_COLLECTION)
        .find({})
        .sort({ timestamp: -1 })
        .toArray()

      const visitorHeaders = ['timestamp', 'ip', 'userAgent', 'referer', 'location', 'device', 'browser']
      const visitorCSV = convertToCSV(
        visitors.map(v => ({
          timestamp: new Date(v.timestamp).toLocaleString(),
          ip: v.ip || 'Unknown',
          userAgent: v.userAgent || 'Unknown',
          referer: v.referer || 'Direct',
          location: v.location || 'Unknown',
          device: v.device || 'Unknown',
          browser: v.browser || 'Unknown'
        })),
        visitorHeaders
      )

      exportData += '=== WEBSITE VISITORS ===\n' + visitorCSV + '\n\n'
    }

    if (type === 'forms' || type === 'all') {
      console.log('📝 Exporting contact forms...')
      const forms = await db.collection<FormDocument>(FORMS_COLLECTION)
        .find({})
        .sort({ timestamp: -1 })
        .toArray()

      const formHeaders = ['timestamp', 'name', 'email', 'phone', 'message', 'preferredTime', 'status', 'ip']
      const formCSV = convertToCSV(
        forms.map(f => ({
          timestamp: new Date(f.timestamp).toLocaleString(),
          name: f.name || 'N/A',
          email: f.email || 'N/A',
          phone: f.phone || 'N/A',
          message: (f.message || 'N/A').replace(/\n/g, ' '),
          preferredTime: f.preferredTime || 'N/A',
          status: f.status || 'new',
          ip: f.ip || 'Unknown'
        })),
        formHeaders
      )

      exportData += '=== CONTACT FORMS ===\n' + formCSV + '\n\n'
    }

    if (type === 'clients' || type === 'all') {
      console.log('👤 Exporting clients...')
      const clients = await db.collection<ClientDocument>(CLIENTS_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray()

      const clientHeaders = ['createdAt', 'name', 'email', 'phone', 'status', 'totalProjects', 'notes', 'lastContact']
      const clientCSV = convertToCSV(
        clients.map(c => ({
          createdAt: new Date(c.createdAt).toLocaleString(),
          name: c.name || 'N/A',
          email: c.email || 'N/A',
          phone: c.phone || 'N/A',
          status: c.status || 'active',
          totalProjects: c.projects ? c.projects.length : 0,
          notes: (c.notes || 'N/A').replace(/\n/g, ' '),
          lastContact: new Date(c.lastContact).toLocaleString()
        })),
        clientHeaders
      )

      exportData += '=== CLIENTS ===\n' + clientCSV + '\n\n'

      // Export client projects separately - FIXED
      const allProjects: Record<string, unknown>[] = []
      clients.forEach(client => {
        if (client.projects && client.projects.length > 0) {
          // FIXED: Proper typing for project
          client.projects.forEach((project: Project) => {
            allProjects.push({
              clientName: client.name,
              clientEmail: client.email,
              projectName: project.name,
              // FIXED: Now TypeScript knows project.description is a string
              projectDescription: (project.description || 'N/A').replace(/\n/g, ' '),
              projectStatus: project.status || 'planning',
              projectBudget: project.budget || 'N/A',
              projectStartDate: project.startDate || 'N/A',
              projectEndDate: project.endDate || 'N/A',
              projectCreatedAt: new Date(project.createdAt).toLocaleString()
            })
          })
        }
      })

      if (allProjects.length > 0) {
        const projectHeaders = ['clientName', 'clientEmail', 'projectName', 'projectDescription', 'projectStatus', 'projectBudget', 'projectStartDate', 'projectEndDate', 'projectCreatedAt']
        const projectCSV = convertToCSV(allProjects, projectHeaders)
        exportData += '=== CLIENT PROJECTS ===\n' + projectCSV + '\n\n'
      }
    }

    // Set filename based on type
    if (type === 'visitors') filename = 'visitors_data.csv'
    else if (type === 'forms') filename = 'contact_forms.csv'
    else if (type === 'clients') filename = 'clients_data.csv'
    else filename = `portfolio_complete_data_${new Date().toISOString().split('T')[0]}.csv`

    console.log(`✅ Excel export completed: ${filename}`)

    // Return CSV data with proper headers for Excel
    return new NextResponse(exportData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to export data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
