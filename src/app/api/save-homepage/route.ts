import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, images } = body

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection('homepage')

    // Update or insert the homepage content
    const result = await collection.updateOne(
      { _id: 'homepage' as any },
      { 
        $set: { 
          content,
          images,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Homepage content saved successfully',
      result 
    })

  } catch (error) {
    console.error('Error saving homepage content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save homepage content' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('portfolio')
    const collection = db.collection('homepage')

    // Get the homepage content
    const homepage = await collection.findOne({ _id: 'homepage' as any })

    return NextResponse.json({ 
      success: true, 
      data: homepage || { content: {}, images: {} }
    })

  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage content' },
      { status: 500 }
    )
  }
} 