import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    
    const envVars = {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    // Also include presence (not value) of critical DB and Cloudinary vars
    const hasMongo = !!process.env.MONGODB_URI;
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
    const hasCloudPreset = !!process.env.CLOUDINARY_UPLOAD_PRESET;

    // Try a lightweight DB connectivity check
    let dbStatus: { ok: boolean; error?: string; projectsCount?: number } = { ok: false };
    try {
      const client = await clientPromise;
      const db = client.db('portfolio');
      const count = await db.collection('projects').estimatedDocumentCount();
      dbStatus = { ok: true, projectsCount: count };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      dbStatus = { ok: false, error: message };
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      vars: {
        MONGODB_URI: hasMongo ? 'SET' : 'NOT SET',
        CLOUDINARY_CLOUD_NAME: hasCloudName ? 'SET' : 'NOT SET',
        CLOUDINARY_UPLOAD_PRESET: hasCloudPreset ? 'SET' : 'NOT SET',
      },
      database: dbStatus,
      message: 'Environment variables checked'
    });

  } catch (error) {
    console.error('❌ Debug failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug failed'
    });
  }
} 