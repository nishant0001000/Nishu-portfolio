import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const VISITORS_COLLECTION = 'visitors'
const FORMS_COLLECTION = 'forms'
const CLIENTS_COLLECTION = 'clients'
const COUNTERS_COLLECTION = 'counters'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// GET endpoint to create a complete backup
export async function GET() {
  try {
    
    const db = await getDb()
    const timestamp = new Date().toISOString()

    // Get all data from all collections
    const [visitors, forms, clients, counters] = await Promise.all([
      db.collection(VISITORS_COLLECTION).find({}).toArray(),
      db.collection(FORMS_COLLECTION).find({}).toArray(),
      db.collection(CLIENTS_COLLECTION).find({}).toArray(),
      db.collection(COUNTERS_COLLECTION).find({}).toArray()
    ])

    // Create backup object
    const backupData = {
      metadata: {
        backupDate: timestamp,
        version: '1.0',
        database: DB_NAME,
        totalRecords: visitors.length + forms.length + clients.length + counters.length
      },
      collections: {
        visitors: {
          count: visitors.length,
          data: visitors
        },
        forms: {
          count: forms.length,
          data: forms
        },
        clients: {
          count: clients.length,
          data: clients
        },
        counters: {
          count: counters.length,
          data: counters
        }
      },
      statistics: {
        totalVisitors: visitors.length,
        totalForms: forms.length,
        totalClients: clients.length,
        backupSize: JSON.stringify({visitors, forms, clients, counters}).length
      }
    }


    const filename = `portfolio_backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`

    // Return JSON backup file
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (error) {
    console.error('❌ Error creating backup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// POST endpoint to restore from backup
export async function POST(request: NextRequest) {
  try {
    
    const backupData = await request.json()
    
    if (!backupData.collections) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid backup format' 
      })
    }

    const db = await getDb()

    // Clear existing data (optional - be careful!)
    // await db.collection(VISITORS_COLLECTION).deleteMany({})
    // await db.collection(FORMS_COLLECTION).deleteMany({})
    // await db.collection(CLIENTS_COLLECTION).deleteMany({})
    // await db.collection(COUNTERS_COLLECTION).deleteMany({})

    let restoredCount = 0

    // Restore visitors
    if (backupData.collections.visitors?.data?.length > 0) {
      await db.collection(VISITORS_COLLECTION).insertMany(backupData.collections.visitors.data)
      restoredCount += backupData.collections.visitors.data.length
    }

    // Restore forms
    if (backupData.collections.forms?.data?.length > 0) {
      await db.collection(FORMS_COLLECTION).insertMany(backupData.collections.forms.data)
      restoredCount += backupData.collections.forms.data.length
    }

    // Restore clients
    if (backupData.collections.clients?.data?.length > 0) {
      await db.collection(CLIENTS_COLLECTION).insertMany(backupData.collections.clients.data)
      restoredCount += backupData.collections.clients.data.length
    }

    // Restore counters
    if (backupData.collections.counters?.data?.length > 0) {
      await db.collection(COUNTERS_COLLECTION).insertMany(backupData.collections.counters.data)
      restoredCount += backupData.collections.counters.data.length
    }


    return NextResponse.json({
      success: true,
      message: `Database restored successfully! ${restoredCount} records restored.`,
      restoredCount,
      backupDate: backupData.metadata?.backupDate
    })
    
  } catch (error) {
    console.error('❌ Error restoring backup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to restore backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}