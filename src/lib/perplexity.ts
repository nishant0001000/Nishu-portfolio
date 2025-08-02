// Perplexity AI API Service
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export async function searchWithPerplexity(query: string): Promise<string> {
  try {
    const response = await fetch('/api/perplexity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    throw error;
  }
} 