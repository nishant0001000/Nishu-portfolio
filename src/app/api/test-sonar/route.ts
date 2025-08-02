import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    console.log('🔑 Testing API Key...');
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length);
    console.log('🔑 API Key starts with:', apiKey?.substring(0, 10) + '...');

    if (!apiKey) {
      return NextResponse.json({
        error: 'API key not found',
        success: false
      });
    }

    // Test with a simple request
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 50
      })
    });

    console.log('🔍 Test Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Test API Error:', errorText);
      return NextResponse.json({
        error: `API test failed: ${response.status}`,
        details: errorText,
        success: false
      });
    }

    const data = await response.json();
    console.log('✅ Test API Success:', data);

    return NextResponse.json({
      success: true,
      message: 'API key is working!',
      response: data.choices[0]?.message?.content
    });

  } catch (error) {
    console.error('❌ Test Error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
} 