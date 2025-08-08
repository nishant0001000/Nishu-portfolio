import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Type definitions - ADD THESE
interface CountersDocument {
  _id: string
  totalVisitors: number
  totalForms: number
  totalClients?: number
}

// Database and collection names
const DB_NAME = 'portfolio_tracking'
// const VISITORS_COLLECTION = 'visitors' // No longer used since we don't store visitor data
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

// Helper function to cleanup old records (no longer needed since we don't store visitor data)
// const cleanupOldRecords = async () => {
//   // No visitor data to cleanup since we only store counters
//   return 0
// }

// GET endpoint to fetch visitor stats (no individual visitor data stored)
export async function GET() {
  try {
    console.log('📊 Fetching visitor statistics...')
    
    // Get counters
    const counters = await getCounters()
    console.log(`📈 Total visitors counter: ${counters.totalVisitors}`)

    return NextResponse.json({
      success: true,
      totalVisitors: counters.totalVisitors,
      visitorChange: 0, // No monthly tracking since we don't store individual visitor data
      message: 'Visitors are only counted, individual data is not stored for privacy',
      visitors: [], // Empty array since we don't store visitor data
      note: 'Only form submissions store detailed data (location, device, etc.)'
    })
    
  } catch (error) {
    console.error('❌ Error fetching visitor stats:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch visitor stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE endpoint for manual cleanup (no visitor data to cleanup)
export async function DELETE() {
  try {
    console.log('🧹 Manual cleanup requested...')
    
    return NextResponse.json({
      success: true,
      message: 'No visitor data to cleanup - visitors are only counted, not stored individually.',
      deletedCount: 0,
      note: 'Only form submission data is stored and can be cleaned up via the forms API.'
    })
    
  } catch (error) {
    console.error('❌ Error during manual cleanup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process cleanup request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
