import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const COLLECTION = 'herovideo';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

export async function POST(request: NextRequest) {
  try {
    const { url, public_id } = await request.json();
    if (!url || !public_id) {
      return NextResponse.json({ success: false, error: 'No URL or public_id provided' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection(COLLECTION).insertOne({ url, public_id, createdAt: new Date().toISOString() });
    return NextResponse.json({ success: true, video: { url, public_id, _id: result.insertedId } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const videos = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, public_id } = await request.json();
    if (!id || !public_id) return NextResponse.json({ success: false, error: 'No id or public_id provided' }, { status: 400 });
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ success: false, error: 'Cloudinary env variables missing' }, { status: 500 });
    }
    // Delete from Cloudinary
    const basicAuth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/video/upload?public_ids[]=${public_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Basic ${basicAuth}` },
    });
    const text = await cloudinaryRes.text();
    let cloudinaryData;
    try { cloudinaryData = JSON.parse(text); } catch (e) {
      console.error('Cloudinary delete response (not JSON):', text);
      return NextResponse.json({ success: false, error: 'Cloudinary delete did not return JSON', raw: text }, { status: 500 });
    }
    // Accept deleted or not_found as success
    const deletedValues = cloudinaryData.deleted ? Object.values(cloudinaryData.deleted) : [];
    if (
      cloudinaryData.result !== 'ok' &&
      cloudinaryData.result !== 'not found' &&
      !deletedValues.includes('deleted') &&
      !deletedValues.includes('not_found')
    ) {
      console.error('Cloudinary delete error:', cloudinaryData);
      return NextResponse.json({ success: false, error: 'Failed to delete from Cloudinary', cloudinaryData }, { status: 500 });
    }
    // Delete from DB
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    let mongoResult = null;
    try {
      if (!ObjectId.isValid(id)) {
        console.error('Invalid MongoDB ObjectId:', id);
        return NextResponse.json({ success: false, error: 'Invalid MongoDB ObjectId', id }, { status: 400 });
      }
      const objectId = new ObjectId(id);
      mongoResult = await db.collection(COLLECTION).deleteOne({ _id: objectId });
      console.log('Mongo delete attempt:', { id, objectId: objectId.toString(), mongoResult });
      if (mongoResult.deletedCount !== 1) {
        return NextResponse.json({ success: false, error: 'MongoDB: No record deleted', id, objectId: objectId.toString(), mongoResult }, { status: 500 });
      }
    } catch (e) {
      console.error('MongoDB delete error:', e);
      return NextResponse.json({ success: false, error: 'MongoDB delete error', details: e instanceof Error ? e.message : e }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/herovideo error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
