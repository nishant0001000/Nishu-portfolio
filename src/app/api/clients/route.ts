import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Type definitions - FIXED
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
  originalMessage?: string
  preferredTime?: string
}

interface CountersDocument {
  _id: string
  totalVisitors: number
  totalForms: number
  totalClients: number
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const CLIENTS_COLLECTION = 'clients'
const FORMS_COLLECTION = 'forms'
const COUNTERS_COLLECTION = 'counters'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper function to get counters
const getCounters = async (): Promise<CountersDocument> => {
  const db = await getDb()
  
  const counters = await db.collection<CountersDocument>(COUNTERS_COLLECTION).findOne(
    { _id: 'main' }
  )
  
  return counters || { _id: 'main', totalVisitors: 0, totalForms: 0, totalClients: 0 }
}

// Helper function to update counters
const updateCounters = async (type: 'client') => {
  const db = await getDb()
  const field = type === 'client' ? 'totalClients' : 'totalClients'
  
  await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
    { _id: 'main' },
    { $inc: { [field]: 1 } },
    { upsert: true }
  )
}

// GET endpoint to fetch all clients
export async function GET() {
  try {
    
    const db = await getDb()
    
    // Get all clients (sorted by latest first)
    const clients = await db.collection<ClientDocument>(CLIENTS_COLLECTION)
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray()


    // Get counters
    const counters = await getCounters()

    // Calculate percentage changes for current vs previous month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Count clients for current and previous month
    const clientsThisMonth = await db.collection(CLIENTS_COLLECTION).countDocuments({
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1).toISOString(),
        $lt: new Date(currentYear, currentMonth + 1, 1).toISOString()
      }
    })
    
    const clientsLastMonth = await db.collection(CLIENTS_COLLECTION).countDocuments({
      createdAt: {
        $gte: new Date(prevYear, prevMonth, 1).toISOString(),
        $lt: new Date(prevYear, prevMonth + 1, 1).toISOString()
      }
    })

    // Calculate percentage change
    const calcChange = (current: number, prev: number) => {
      if (prev === 0 && current === 0) return 0
      if (prev === 0) return 100
      return Math.round(((current - prev) / prev) * 100)
    }
    
    const clientChange = calcChange(clientsThisMonth, clientsLastMonth)

    return NextResponse.json({
      success: true,
      totalClients: counters.totalClients || clients.length,
      clientChange,
      clientsThisMonth,
      clientsLastMonth,
      clients: clients.map(client => ({
        id: client.id || client._id.toString(),
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status || 'active',
        projects: client.projects || [],
        createdAt: client.createdAt,
        lastContact: client.lastContact,
        notes: client.notes || '',
        originalFormId: client.originalFormId,
        totalProjects: client.projects ? client.projects.length : 0
      }))
    })
    
  } catch (error) {
    console.error('❌ Error fetching clients:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch clients',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint - FIXED
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, formId, clientData, projectData } = body

    const db = await getDb()

    if (action === 'convert_to_client') {
      
      const form = await db.collection(FORMS_COLLECTION).findOne({ id: formId })
      if (!form) {
        return NextResponse.json({ success: false, error: 'Form not found' }, { status: 404 })
      }

      const existingClient = await db.collection(CLIENTS_COLLECTION).findOne({ 
        originalFormId: formId 
      })
      
      if (existingClient) {
        return NextResponse.json({ 
          success: false, 
          error: 'Client already exists for this form request' 
        }, { status: 400 })
      }

      const newClient: ClientDocument = {
        _id: new ObjectId(),
        id: Date.now().toString(),
        name: form.name as string,
        email: form.email as string,
        phone: form.phone as string,
        status: 'active',
        projects: [],
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        notes: `Converted from form request. Original message: ${form.message}`,
        originalFormId: formId,
        originalMessage: form.message as string,
        preferredTime: form.preferredTime as string
      }

      await db.collection<ClientDocument>(CLIENTS_COLLECTION).insertOne(newClient)
      await updateCounters('client')

      // Remove the form from forms collection now that it's converted
      await db.collection(FORMS_COLLECTION).deleteOne({ id: formId })
      // Decrement totalForms counter
      await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
        { _id: 'main' },
        { $inc: { totalForms: -1 } },
        { upsert: true }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Form request converted to client and removed from forms',
        clientId: newClient.id
      })
    }

    if (action === 'mark_contacted') {
      
      await db.collection(FORMS_COLLECTION).updateOne(
        { id: formId },
        { 
          $set: { 
            status: 'contacted',
            contactedAt: new Date().toISOString()
          }
        }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Form marked as contacted successfully'
      })
    }

    if (action === 'unmark_contacted') {
      
      await db.collection(FORMS_COLLECTION).updateOne(
        { id: formId },
        { 
          $unset: { 
            status: "",
            contactedAt: ""
          }
        }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Form set back to uncontacted'
      })
    }

    if (action === 'add_project') {
      
      // FIXED: Proper typing for project object
      const project: Project = {
        id: Date.now().toString(),
        name: projectData.name as string,
        description: projectData.description as string,
        status: (projectData.status as string) || 'planning',
        startDate: projectData.startDate as string,
        endDate: projectData.endDate as string,
        budget: Number(projectData.budget) || 0,
        createdAt: new Date().toISOString()
      }

      // FIXED: Using proper generic typing
      await db.collection<ClientDocument>(CLIENTS_COLLECTION).updateOne(
        { id: clientData.clientId as string },
        { 
          $push: { projects: project },
          $set: { lastContact: new Date().toISOString() }
        }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Project added to client successfully',
        projectId: project.id
      })
    }

    if (action === 'update_project') {
      const clientId: string = clientData.clientId as string
      const projectId: string = projectData.projectId as string
      const updates: Partial<Project> = {
        ...(projectData.name && { name: projectData.name as string }),
        ...(projectData.description && { description: projectData.description as string }),
        ...(projectData.status && { status: projectData.status as string }),
        ...(projectData.startDate && { startDate: projectData.startDate as string }),
        ...(projectData.endDate && { endDate: projectData.endDate as string }),
        ...(projectData.budget && { budget: Number(projectData.budget) })
      }

      const setObject: { [path: string]: string | number } = {}
      const keys = Object.keys(updates) as Array<keyof Project>
      for (const key of keys) {
        const value = updates[key]
        if (typeof value !== 'undefined') {
          // All Project fields are string or number; coerce accordingly
          setObject[`projects.$.${String(key)}`] = (typeof value === 'number' || typeof value === 'string')
            ? (value as number | string)
            : String(value)
        }
      }

      if (Object.keys(setObject).length === 0) {
        return NextResponse.json({ success: false, error: 'No updates provided' }, { status: 400 })
      }

      const db = await getDb()
      const result = await db.collection<ClientDocument>(CLIENTS_COLLECTION).updateOne(
        { id: clientId, 'projects.id': projectId },
        { $set: { ...setObject, lastContact: new Date().toISOString() } }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Client or project not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true, message: 'Project updated successfully' })
    }

    if (action === 'update_client') {
      
      const updateData = {
        ...(clientData.name && { name: clientData.name as string }),
        ...(clientData.email && { email: clientData.email as string }),
        ...(clientData.phone && { phone: clientData.phone as string }),
        ...(clientData.status && { status: clientData.status as string }),
        ...(clientData.notes && { notes: clientData.notes as string }),
        lastContact: new Date().toISOString()
      }

      await db.collection<ClientDocument>(CLIENTS_COLLECTION).updateOne(
        { id: clientData.clientId as string },
        { $set: updateData }
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Client updated successfully'
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Error in client operation:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Client operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID required' }, { status: 400 })
    }

    
    const db = await getDb()
    const result = await db.collection<ClientDocument>(CLIENTS_COLLECTION).deleteOne({ id: clientId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 })
    }

    // Update counter
    await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
      { _id: 'main' },
      { $inc: { totalClients: -1 } }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Client deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ Error deleting client:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete client',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
