import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const VISITORS_COLLECTION = 'visitors'
const FORMS_COLLECTION = 'forms'
const COUNTERS_COLLECTION = 'counters'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// Helper function to get counters
const getCounters = async () => {
  const db = await getDb()
  const counters = await db.collection(COUNTERS_COLLECTION).findOne({ _id: 'main' } as any)
  return counters || { totalVisitors: 0, totalForms: 0 }
}

// Helper function to update counters
const updateCounters = async (type: 'visitor' | 'form') => {
  const db = await getDb()
  const field = type === 'visitor' ? 'totalVisitors' : 'totalForms'
  await db.collection(COUNTERS_COLLECTION).updateOne(
    { _id: 'main' } as any,
    { $inc: { [field]: 1 } },
    { upsert: true }
  )
}

// Helper function to cleanup old records (older than 15 days)
const cleanupOldRecords = async () => {
  const db = await getDb()
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

  // Cleanup old visitors
  await db.collection(VISITORS_COLLECTION).deleteMany({
    timestamp: { $lt: fifteenDaysAgo.toISOString() }
  })

  // Cleanup old forms
  await db.collection(FORMS_COLLECTION).deleteMany({
    timestamp: { $lt: fifteenDaysAgo.toISOString() }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { type, visitorInfo } = await request.json()
    
    if (type === 'visitor') {
      const db = await getDb()
      const newVisitor = {
        _id: new ObjectId(),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        referer: request.headers.get('referer') || 'direct',
        ...visitorInfo
      }

      await db.collection(VISITORS_COLLECTION).insertOne(newVisitor)
      await updateCounters('visitor')
      
      const counters = await getCounters()
      return NextResponse.json({ 
        success: true, 
        totalVisitors: counters.totalVisitors
      })
    }
    
    if (type === 'form') {
      const db = await getDb()
      const newForm = {
        _id: new ObjectId(),
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        ...visitorInfo
      }

      await db.collection(FORMS_COLLECTION).insertOne(newForm)
      await updateCounters('form')
      
      const counters = await getCounters()
      return NextResponse.json({ 
        success: true, 
        totalForms: counters.totalForms
      })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid type' })
    
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ success: false, error: 'Tracking failed' })
  }
}

export async function GET() {
  try {
    const db = await getDb()
    
    // Cleanup old records first
    await cleanupOldRecords()
    
    // Get counters
    const counters = await getCounters()
    
    // Get recent visitors and forms (last 10)
    const recentVisitors = await db.collection(VISITORS_COLLECTION)
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()
    
    const recentForms = await db.collection(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Calculate percentage changes
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Count visitors for current and previous month
    const visitorsThisMonth = await db.collection(VISITORS_COLLECTION).countDocuments({
      timestamp: {
        $gte: new Date(currentYear, currentMonth, 1).toISOString(),
        $lt: new Date(currentYear, currentMonth + 1, 1).toISOString()
      }
    })
    
    const visitorsLastMonth = await db.collection(VISITORS_COLLECTION).countDocuments({
      timestamp: {
        $gte: new Date(prevYear, prevMonth, 1).toISOString(),
        $lt: new Date(prevYear, prevMonth + 1, 1).toISOString()
      }
    })

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
    
    const visitorChange = calcChange(visitorsThisMonth, visitorsLastMonth)
    const formChange = calcChange(formsThisMonth, formsLastMonth)

    return NextResponse.json({
      success: true,
      totalVisitors: counters.totalVisitors,
      totalForms: counters.totalForms,
      visitorChange,
      formChange,
      recentVisitors,
      recentForms
    })
    
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to get stats' })
  }
}
