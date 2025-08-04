import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Email sending function
async function sendErrorEmail(errorDetails: {
  errorType: string;
  message: string;
  status: number;
  modelName: string;
}, userMessage: string) {
  try {
    // Get the base URL dynamically
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://nishu-portfolio-seven.vercel.app';
    

    
    // Call our email API route
    const response = await fetch(`${baseUrl}/api/send-error-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errorDetails,
        userMessage
      }),
    });

    const responseData = await response.json();
    
    if (response.ok && responseData.success) {
      console.log('✅ Error email sent successfully to rajputvashu429@gmail.com');
    } else {
      console.error('❌ Failed to send error email:', response.status, responseData);
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

export async function POST(request: NextRequest) {
  // Declare variables outside try block so they're available in catch block
  let message: string = '';
  let modelType: string = '';
  let model: string = '';
  let modelName: string = 'Unknown';
  

  
  try {
    const requestData = await request.json();
    message = requestData.message;
    modelType = requestData.modelType;

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use the provided OpenRouter API Key from environment
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    

    
    if (!openRouterKey) {
      const errorDetails = {
        errorType: 'Missing API Key',
        message: 'OpenRouter API key not found in environment variables',
        status: 500,
        modelName: 'Unknown'
      };
      
      await sendErrorEmail(errorDetails, message);
      
      return NextResponse.json(
        { 
          success: false,
          error: 'AI models are currently being updated. Please wait a moment and try again.',
          userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
        },
        { status: 500 }
      );
    }

    // Initialize OpenRouter client
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openRouterKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://nishu-portfolio-seven.vercel.app',
        'X-Title': 'Nishant Portfolio AI',
      },
    });

    // Determine model based on modelType

    switch (modelType) {
      case 'gemini':
        model = 'google/gemini-2.0-flash-exp:free';
        modelName = 'Nishu AI (Gemini 2.0 Flash)';
        break;
      case 'mistral':
        model = 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free';
        modelName = 'Nishu 2.0 (Venice)';
        break;
      case 'qwen':
        model = 'mistralai/mistral-7b-instruct:free';
        modelName = 'Nishu 3.0 (Mistral 7B)';
        break;
      default:
        model = 'google/gemini-2.0-flash-exp:free';
        modelName = 'Nishu AI (Gemini 2.0 Flash)';
    }



    // Create completion with speed optimizations
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0,
    });


    
    return NextResponse.json({
      success: true,
      response: completion.choices[0].message.content,
      model_used: modelName,
      usage: completion.usage || { total_tokens: 0 }
    });

  } catch (error: unknown) {

    // Prepare error details for email
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStatus = (error as { status?: number })?.status || 500;
    
    const errorDetails = {
      errorType: 'API Error',
      message: errorMessage,
      status: errorStatus,
      modelName: modelName || 'Unknown'
    };

    // Send error email
    await sendErrorEmail(errorDetails, message);
    
    // Handle insufficient credits error
    if (errorStatus === 402 || errorMessage.includes('402') || errorMessage.includes('Insufficient credits')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'AI models are currently being updated. Please wait a moment and try again.',
          userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
        },
        { status: 402 }
      );
    }

    // Handle specific OpenRouter rate limit errors
    if (errorStatus === 429) {
      return NextResponse.json(
        { 
          success: false,
          error: 'AI models are currently being updated. Please wait a moment and try again.',
          userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
        },
        { status: 429 }
      );
    }

    // Handle API key errors
    if (errorStatus === 401) {
      return NextResponse.json(
        { 
          success: false,
          error: 'AI models are currently being updated. Please wait a moment and try again.',
          userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
        },
        { status: 401 }
      );
    }

    // Handle model not found errors
    if (errorStatus === 404) {
      return NextResponse.json(
        { 
          success: false,
          error: 'AI models are currently being updated. Please wait a moment and try again.',
          userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
        },
        { status: 404 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: 'AI models are currently being updated. Please wait a moment and try again.',
        userMessage: 'Sorry! Our AI models are currently being updated for future improvements. Please wait a moment and try again. Our AI is the fastest AI in the world!'
      },
      { status: 500 }
    );
  }
} 