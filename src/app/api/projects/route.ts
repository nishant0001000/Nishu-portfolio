import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB || 'portfolio'
const COLLECTION = process.env.MONGODB_COLLECTION_PROJECTS || 'projects'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const docs = await db
      .collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray()
    return NextResponse.json({ success: true, data: docs, count: docs.length })
  } catch (e) {
    console.error('GET /api/projects error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to fetch projects: ${message}` }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, technologies, link, imageUrl, category } = body || {}
    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: 'Missing title or imageUrl' }, { status: 400 })
    }
    const project = {
      title,
      description: description || '',
      technologies: Array.isArray(technologies) ? technologies : [],
      link: link || '',
      imageUrl,
      category: category || 'Website',
      createdAt: new Date()
    }
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const result = await db.collection(COLLECTION).insertOne(project as Record<string, unknown>)
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...project } })
  } catch (e) {
    console.error('POST /api/projects error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to create project: ${message}` }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { _id, title, description, technologies, link, imageUrl, category } = body || {}
    if (!_id) return NextResponse.json({ success: false, error: 'Missing _id' }, { status: 400 })
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const { ObjectId } = await import('mongodb')
    const update: Record<string, unknown> = {}
    if (title !== undefined) update.title = title
    if (description !== undefined) update.description = description
    if (technologies !== undefined) update.technologies = technologies
    if (link !== undefined) update.link = link
    if (imageUrl !== undefined) update.imageUrl = imageUrl
    if (category !== undefined) update.category = category
    await db.collection(COLLECTION).updateOne({ _id: new ObjectId(String(_id)) }, { $set: update })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('PUT /api/projects error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to update project: ${message}` }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const client = await clientPromise
    const db = client.db(DB_NAME)
    const { ObjectId } = await import('mongodb')
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(String(id)) })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/projects error:', e)
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ success: false, error: `Failed to delete project: ${message}` }, { status: 500 })
  }
} 