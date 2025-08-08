import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const FORMS_COLLECTION = 'forms'

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// POST endpoint to remove duplicate forms
export async function POST() {
  try {
    console.log('🧹 Starting duplicate cleanup...')
    
    const db = await getDb()
    
    // Get all forms
    const allForms = await db.collection(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: 1 }) // oldest first
      .toArray()

    console.log(`📊 Found ${allForms.length} total forms`)

    // Group by email + name + phone to find duplicates
    const formGroups = new Map()
    
    for (const form of allForms) {
      const key = `${form.email}-${form.name}-${form.phone}`
      if (!formGroups.has(key)) {
        formGroups.set(key, [])
      }
      formGroups.get(key).push(form)
    }

    let duplicatesRemoved = 0
    
    // Remove duplicates (keep the latest one)
    for (const [key, forms] of formGroups) {
      if (forms.length > 1) {
        console.log(`🔍 Found ${forms.length} duplicates for: ${key}`)
        
        // Sort by timestamp (latest first) and keep the first one
        forms.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        const toKeep = forms[0]
        const toRemove = forms.slice(1)
        
        console.log(`✅ Keeping form from: ${toKeep.timestamp}`)
        
        // Remove duplicates
        for (const duplicate of toRemove) {
          await db.collection(FORMS_COLLECTION).deleteOne({ _id: duplicate._id })
          duplicatesRemoved++
          console.log(`🗑️ Removed duplicate from: ${duplicate.timestamp}`)
        }
      }
    }

    // Get updated count
    const remainingForms = await db.collection(FORMS_COLLECTION).countDocuments()
    
    console.log(`✅ Cleanup completed!`)
    console.log(`🗑️ Removed ${duplicatesRemoved} duplicate forms`)
    console.log(`📊 Remaining forms: ${remainingForms}`)

    return NextResponse.json({
      success: true,
      message: `Cleanup completed! Removed ${duplicatesRemoved} duplicate forms.`,
      duplicatesRemoved,
      remainingForms,
      totalProcessed: allForms.length
    })
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to cleanup duplicates',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// GET endpoint to check for duplicates without removing
export async function GET() {
  try {
    console.log('🔍 Checking for duplicates...')
    
    const db = await getDb()
    
    // Get all forms
    const allForms = await db.collection(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: 1 })
      .toArray()

    // Group by email + name + phone to find duplicates
    const formGroups = new Map()
    
    for (const form of allForms) {
      const key = `${form.email}-${form.name}-${form.phone}`
      if (!formGroups.has(key)) {
        formGroups.set(key, [])
      }
      formGroups.get(key).push(form)
    }

    const duplicateGroups = []
    let totalDuplicates = 0
    
    for (const [key, forms] of formGroups) {
      if (forms.length > 1) {
        duplicateGroups.push({
          key,
          count: forms.length,
          forms: forms.map(f => ({
            id: f.id,
            timestamp: f.timestamp,
            name: f.name,
            email: f.email
          }))
        })
        totalDuplicates += forms.length - 1 // -1 because we keep one
      }
    }

    return NextResponse.json({
      success: true,
      totalForms: allForms.length,
      duplicateGroups,
      totalDuplicates,
      uniqueForms: allForms.length - totalDuplicates
    })
    
  } catch (error) {
    console.error('❌ Error checking duplicates:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check duplicates',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}