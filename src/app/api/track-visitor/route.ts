import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Type definitions - ADD THESE
interface CountersDocument {
  _id: string
  totalVisitors: number
  totalForms: number
  totalClients?: number
}

interface FormDocument {
  _id: ObjectId
  id: string
  timestamp: string
  ip: string
  userAgent: string
  referer: string
  [key: string]: unknown // for visitor info and other fields
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
// const VISITORS_COLLECTION = 'visitors' // No longer used since we don't store visitor data
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
  
  // FIXED: Using generic typing instead of raw string
  const counters = await db.collection<CountersDocument>(COUNTERS_COLLECTION).findOne({ _id: 'main' })
  
  return counters || { _id: 'main', totalVisitors: 0, totalForms: 0 }
}

// Helper function to update counters - FIXED
const updateCounters = async (type: 'visitor' | 'form') => {
  const db = await getDb()
  const field = type === 'visitor' ? 'totalVisitors' : 'totalForms'
  
  // FIXED: Add generic typing
  await db.collection<CountersDocument>(COUNTERS_COLLECTION).updateOne(
    { _id: 'main' },
    { $inc: { [field]: 1 } },
    { upsert: true }
  )
}

// Helper function to cleanup old records (older than 15 days) - FIXED
const cleanupOldRecords = async (): Promise<number> => {
  const db = await getDb()
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

  // Only cleanup old forms (no visitor data to cleanup since we don't store it)
  // FIXED: Add generic typing
  const result = await db.collection<FormDocument>(FORMS_COLLECTION).deleteMany({
    timestamp: { $lt: fifteenDaysAgo.toISOString() }
  })
  
  return result.deletedCount
}

export async function POST(request: NextRequest) {
  try {
    const { type, visitorInfo } = await request.json()
    
    if (type === 'visitor') {
      // For visitors, only increment counter - don't store individual data
      await updateCounters('visitor')
      
      const counters = await getCounters()
      
      return NextResponse.json({ 
        success: true, 
        totalVisitors: counters.totalVisitors,
        message: 'Visitor counted successfully'
      })
    }
    
    if (type === 'form') {
      // For form submissions, store detailed data including location, device info
      const db = await getDb()
      
      // FIXED: Proper typing for new form
      const newForm: FormDocument = {
        _id: new ObjectId(),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        referer: request.headers.get('referer') || 'direct',
        // Store all detailed visitor info for form submissions
        ...visitorInfo
      }

      // FIXED: Add generic typing
      await db.collection<FormDocument>(FORMS_COLLECTION).insertOne(newForm)
      await updateCounters('form')
      
      const counters = await getCounters()
      
      return NextResponse.json({ 
        success: true, 
        totalForms: counters.totalForms,
        message: 'Form submission tracked with detailed data'
      })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    
    // Cleanup old records first (only forms now, no visitor data to cleanup)
    await cleanupOldRecords()
    
    // Get counters
    const counters = await getCounters()
    
    // Get recent forms (last 10) - no visitor data since we don't store it
    // FIXED: Add generic typing
    const recentForms = await db.collection<FormDocument>(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Calculate percentage changes for forms only
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
    
    // For visitors, we can't calculate monthly change since we don't store individual records
    // We'll just return 0 for visitor change
    const visitorChange = 0 // No monthly tracking for visitors since we only store counters
    const formChange = calcChange(formsThisMonth, formsLastMonth)

    return NextResponse.json({
      success: true,
      totalVisitors: counters.totalVisitors,
      totalForms: counters.totalForms,
      visitorChange, // Always 0 since we don't track monthly visitor data
      formChange,
      recentForms: recentForms.map(form => ({
        id: form.id || form._id.toString(),
        timestamp: form.timestamp,
        ip: form.ip,
        userAgent: form.userAgent,
        referer: form.referer
      })),
      message: 'Visitors are only counted, not stored individually'
    })
    
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to get stats' }, { status: 500 })
  }
}
