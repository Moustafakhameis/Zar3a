import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = 'llama3-8b-8192';

const SYSTEM_PROMPT = `You are an expert agricultural consultant for the 'Zar3a' project (BIS Faculty, Helwan University, Egypt). 
            
CRITICAL LANGUAGE RULE:
You MUST respond in the EXACT SAME LANGUAGE the user uses. 
- If the user asks in English, reply ONLY in English.
- If the user asks in Arabic, reply ONLY in Arabic.

Formatting Rules:
1. Be professional, accurate, and academic.
2. Use Markdown styling (### for main headings).
3. Use bullet points (- or *) for steps and solutions.
4. Keep paragraphs concise and use relevant emojis (🌿, 💧, 🍅).`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchGroqChatCompletion = async (messages, model, retries = 2) => {
  let attempt = 0;
  
  while (attempt <= retries) {
    try {
      // Implement timeout logic
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Groq API Timeout')), 30000) // 30 seconds
      );

      const apiCallPromise = groq.chat.completions.create({
        messages,
        model,
        temperature: 0.5,
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);
      return response;

    } catch (error) {
      attempt++;
      
      const status = error.status || (error.response && error.response.status);
      const isRetryable = error.message === 'Groq API Timeout' || [429, 500, 502, 503, 504].includes(status);
      
      if (!isRetryable || attempt > retries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s...
      const delay = Math.pow(2, attempt - 1) * 1000;
      await sleep(delay);
    }
  }
};

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // 1. Validation
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, error: 'Message is required and cannot be empty.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ success: false, error: 'Message exceeds maximum length of 2000 characters.' });
    }
    
    if (!Array.isArray(history)) {
      return res.status(400).json({ success: false, error: 'History must be an array.' });
    }

    // 2. Prepare Messages Array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

    // 3. Log Operational Info (Start)
    const startTime = Date.now();
    console.log(`[AI] Processing chat request...`);

    // 4. API Call
    const completion = await fetchGroqChatCompletion(messages, model);
    const reply = completion.choices[0]?.message?.content || "عذراً، لم أتمكن من المعالجة.";

    // 5. Log Operational Info (End)
    const duration = Date.now() - startTime;
    console.log(`[AI] Request fulfilled - Status: 200 - Duration: ${duration}ms`);

    // 6. Return Response
    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error(`[AI] Chat Error: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      error: 'Unable to generate AI response at this time. Please try again later.'
    });
  }
};
