const HUGGING_FACE_API_KEY = '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';
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

export const askAI = async (question) => {
  try {


    
    console.log('Calling Hugging Face AI API...');
    
    const prompt = `User: ${question}\nAssistant:`;
    
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false,
          repetition_penalty: 1.1
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error details:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    let aiResponse = data[0]?.generated_text || '';
    
    console.log('Raw AI Response:', aiResponse);
    
    aiResponse = aiResponse.trim();
    
    // If response is empty or problematic, throw error
    if (!aiResponse || aiResponse.length < 2 || aiResponse === prompt) {
      throw new Error('AI returned empty response');
    }
    
    console.log('Final AI Response:', aiResponse);
    return aiResponse;

  } catch (error) {
    console.error('Hugging Face API Error:', error);
    throw new Error('AI is taking a moment to wake up. Please try again in a few seconds.');
  }
};