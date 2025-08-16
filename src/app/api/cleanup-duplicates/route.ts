import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Database and collection names
const DB_NAME = 'portfolio_tracking'
const FORMS_COLLECTION = 'forms'

// Define interface for form structure
interface FormDocument {
  _id: ObjectId
  id?: string
  email: string
  name: string
  phone: string
  timestamp: string | Date
  [key: string]: unknown // Fixed: 'any' को 'unknown' में change किया
}

// Helper function to get database
const getDb = async () => {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// POST endpoint to remove duplicate forms
export async function POST() {
  try {
    
    const db = await getDb()
    
    // Get all forms with proper typing
    const allForms: FormDocument[] = await db.collection(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: 1 })
      .toArray() as FormDocument[]


    // Group by email + name + phone to find duplicates
    const formGroups = new Map<string, FormDocument[]>()
    
    for (const form of allForms) {
      const key = `${form.email}-${form.name}-${form.phone}`
      if (!formGroups.has(key)) {
        formGroups.set(key, [])
      }
      formGroups.get(key)!.push(form)
    }

    let duplicatesRemoved = 0
    
    // Remove duplicates (keep the latest one)
    for (const [key, forms] of formGroups) {
      if (forms.length > 1) {
        
        // Fixed sort function with proper typing
        forms.sort((a: FormDocument, b: FormDocument) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        
        const toKeep = forms[0]
        const toRemove = forms.slice(1)
        
        
        // Remove duplicates
        for (const duplicate of toRemove) {
          await db.collection(FORMS_COLLECTION).deleteOne({ _id: duplicate._id })
          duplicatesRemoved++
        }
      }
    }

    // Get updated count
    const remainingForms = await db.collection(FORMS_COLLECTION).countDocuments()
    

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
    }, { status: 500 })
  }
}

// GET endpoint to check for duplicates without removing
export async function GET() {
  try {
    
    const db = await getDb()
    
    // Get all forms with proper typing
    const allForms: FormDocument[] = await db.collection(FORMS_COLLECTION)
      .find({})
      .sort({ timestamp: 1 })
      .toArray() as FormDocument[]

    // Group by email + name + phone to find duplicates
    const formGroups = new Map<string, FormDocument[]>()
    
    for (const form of allForms) {
      const key = `${form.email}-${form.name}-${form.phone}`
      if (!formGroups.has(key)) {
        formGroups.set(key, [])
      }
      formGroups.get(key)!.push(form)
    }

    const duplicateGroups = []
    let totalDuplicates = 0
    
    for (const [key, forms] of formGroups) {
      if (forms.length > 1) {
        duplicateGroups.push({
          key,
          count: forms.length,
          forms: forms.map((f: FormDocument) => ({
            id: f.id,
            timestamp: f.timestamp,
            name: f.name,
            email: f.email
          }))
        })
        totalDuplicates += forms.length - 1
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
    }, { status: 500 })
  }
}
