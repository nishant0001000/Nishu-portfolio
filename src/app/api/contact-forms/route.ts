import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Type definitions
interface CountersDocument {
  _id: string
  totalVisitors: number
  totalForms: number
  totalClients: number
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
  ip: string
  userAgent: string
  status?: 'contacted' | 'converted_to_client' | string
  contactedAt?: string
  convertedAt?: string
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const FORMS_COLLECTION = 'forms'
const COUNTERS_COLLECTION = 'counters'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper function to get counters - FIXED
const getCounters = async (): Promise<CountersDocument> => {
  const db = await getDb()
  
  // FIXED: Using generic typing instead of 'as any'
  const counters = await db.collection<CountersDocument>(COUNTERS_COLLECTION).findOne(
    { _id: 'main' }
  )
  
  return counters || { _id: 'main', totalVisitors: 0, totalForms: 0, totalClients: 0 }
}

// Helper function to cleanup old records (older than 15 days)
const cleanupOldRecords = async (): Promise<number> => {
  const db = await getDb()
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)


  // Cleanup old forms - FIXED: Add generic typing
  const result = await db.collection<FormDocument>(FORMS_COLLECTION).deleteMany({
    timestamp: { $lt: fifteenDaysAgo.toISOString() }
  })

  return result.deletedCount
}

// GET endpoint to fetch all contact forms for admin dashboard
export async function GET() {
  try {
    
    const db = await getDb()
    
    // Cleanup old records first (15+ days old)
    await cleanupOldRecords()
    
    // Get counters
    const counters = await getCounters()
    
    // Get all contact forms (sorted by latest first) - FIXED: Add generic typing
    const contactForms = await db.collection<FormDocument>(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: -1 })
      .toArray()


    // Calculate percentage changes for current vs previous month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Count forms for current and previous month
    const formsThisMonth = await db.collection(FORMS_COLLECTION).countDocuments({
      timestamp: {
        $gte: new Date(currentYear, currentMonth, 1).toISOString(),
        $lt: new Date(currentYear, currentMonth + 1, 1).toISOString()
      }
    })
    
    const formsLastMonth = await db.collection(FORMS_COLLECTION).countDocuments({
      timestamp: {
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
    
    const formChange = calcChange(formsThisMonth, formsLastMonth)

    return NextResponse.json({
      success: true,
      totalForms: counters.totalForms,
      formChange,
      formsThisMonth,
      formsLastMonth,
      contactForms: contactForms.map(form => ({
        id: form.id || form._id.toString(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        preferredTime: form.preferredTime,
        timestamp: form.timestamp,
        ip: form.ip,
        userAgent: form.userAgent,
        status: form.status || undefined,
        contactedAt: form.contactedAt || undefined,
        convertedAt: form.convertedAt || undefined
      }))
    })
    
  } catch (error) {
    console.error('❌ Error fetching contact forms:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch contact forms',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint to manually add a contact form (if needed)
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, preferredTime } = await request.json()
    
    
    const db = await getDb()
    
    // FIXED: Proper typing for new form
    const newForm: FormDocument = {
      _id: new ObjectId(),
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      name: name as string,
      email: email as string,
      phone: phone as string,
      message: message as string,
      preferredTime: preferredTime as string
    }

    // FIXED: Add generic typing
    await db.collection<FormDocument>(FORMS_COLLECTION).insertOne(newForm)
    
    // Update counter - FIXED: Add generic typing
    await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
      { _id: 'main' },
      { $inc: { totalForms: 1 } },
      { upsert: true }
    )
    
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact form added successfully',
      formId: newForm.id
    })
    
  } catch (error) {
    console.error('❌ Error adding contact form:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add contact form',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE endpoint to remove old forms (manual cleanup)
export async function DELETE() {
  try {
    
    const deletedCount = await cleanupOldRecords()
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} old contact forms`,
      deletedCount
    })
    
  } catch (error) {
    console.error('❌ Error during manual cleanup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to cleanup old forms',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
