import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB || 'portfolio'
const COLLECTION = 'categories'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const categories = await db
      .collection(COLLECTION)
      .find({})
      .sort({ name: 1 })
      .toArray()
    
    // Add default categories if none exist
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'Website', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30' },
        { name: 'Web Application', color: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30' },
        { name: 'Mobile Application', color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30' },
        { name: 'UI/UX', color: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-300/30' },
        { name: 'Graphics Design', color: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300/30' },
        { name: '3D', color: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-300/30' }
      ]
      
      await db.collection(COLLECTION).insertMany(defaultCategories)
      return NextResponse.json({ success: true, data: defaultCategories })
    }
    
    return NextResponse.json({ success: true, data: categories })
  } catch (e) {
    console.error('GET /api/categories error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to fetch categories: ${message}` }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, color } = body || {}
    
    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db(DB_NAME)
    
    // Check if category already exists
    const existingCategory = await db.collection(COLLECTION).findOne({ name: name.trim() })
    if (existingCategory) {
      return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 })
    }
    
    const category = {
      name: name.trim(),
      color: color || 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30',
      createdAt: new Date()
    }
    
    const result = await db.collection(COLLECTION).insertOne(category)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...category } })
  } catch (e) {
    console.error('POST /api/categories error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to create category: ${message}` }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { _id, name, color } = body || {}
    
    if (!_id || !name) {
      return NextResponse.json({ success: false, error: 'Category ID and name are required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const { ObjectId } = await import('mongodb')
    
    // Check if name already exists for other categories
    const existingCategory = await db.collection(COLLECTION).findOne({ 
      name: name.trim(), 
      _id: { $ne: new ObjectId(String(_id)) } 
    })
    if (existingCategory) {
      return NextResponse.json({ success: false, error: 'Category name already exists' }, { status: 400 })
    }
    
    const update = {
      name: name.trim(),
      ...(color && { color })
    }
    
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(String(_id)) }, 
      { $set: update }
    )
    
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('PUT /api/categories error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to update category: ${message}` }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const { ObjectId } = await import('mongodb')
    
    // Check if category is being used by any projects
    const projectsUsingCategory = await db.collection('projects').countDocuments({ 
      category: { $exists: true, $ne: null } 
    })
    
    if (projectsUsingCategory > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cannot delete category that is being used by projects' 
      }, { status: 400 })
    }
    
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(String(id)) })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/categories error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to delete category: ${message}` }, { status: 500 })
  }
} 