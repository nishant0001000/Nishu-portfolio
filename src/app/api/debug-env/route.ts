import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Debug Environment Variables');
    
    const envVars = {
      EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET',
      VERCEL_URL: process.env.VERCEL_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    };

    console.log('Environment Variables:', envVars);

    return NextResponse.json({
      success: true,
      environment: envVars,
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