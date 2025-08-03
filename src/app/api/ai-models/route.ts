import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { message, modelType = 'gemini' } = await request.json();

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('🔍 AI Models API Request:', message, 'Model:', modelType);
    
    // Debug environment variables
    console.log('🔍 All environment variables:', Object.keys(process.env).filter(key => key.includes('OPENROUTER')));
    console.log('🔍 OPENROUTER_API_KEY value:', process.env.OPENROUTER_API_KEY ? 'EXISTS' : 'NOT FOUND');
    
    // OpenRouter API Key from environment variable with fallback
    const openRouterKey = process.env.OPENROUTER_API_KEY ;
    
    console.log('🔑 OpenRouter API Key exists:', !!openRouterKey);
    console.log('🔑 OpenRouter API Key length:', openRouterKey?.length);
    console.log('🔑 OpenRouter API Key starts with:', openRouterKey?.substring(0, 10) + '...');
    console.log('🔑 Using environment variable:', !!process.env.OPENROUTER_API_KEY);

    if (!openRouterKey) {
      return NextResponse.json(
        { 
          success: false,
          error: 'OpenRouter API key not found'
        },
        { status: 500 }
      );
    }

    // Initialize OpenRouter client
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Nishant Portfolio AI',
      },
    });

    let modelName, modelDisplayName;

    // Model selection based on modelType
    switch (modelType) {
      case 'gemini':
        modelName = 'google/gemma-3n-e2b-it:free';
        modelDisplayName = 'Nishu AI';
        break;
      case 'deepseek':
        modelName = 'mistralai/mistral-small-3.2-24b-instruct:free';
        modelDisplayName = 'Nishu 2.0';
        break;
      case 'grok':
      default:
        modelName = 'qwen/qwen3-coder:free';
        modelDisplayName = 'Nishu 3.0';
        break;
    }

    console.log('🚀 Using model:', modelName);

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 400,
      temperature: 0.1,
      top_p: 0.9
    });

    console.log('✅ OpenRouter API Success:', {
      tokens: completion.usage?.total_tokens,
      model: completion.model,
      type: modelType
    });
    
    return NextResponse.json({
      success: true,
      response: completion.choices[0]?.message?.content || 'No response received',
      model_used: modelDisplayName,
      citations: [], // OpenRouter doesn't provide citations in the same format
      usage: completion.usage || { total_tokens: 0 }
    });

  } catch (error) {
    console.error('AI Models API Server Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Server error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 