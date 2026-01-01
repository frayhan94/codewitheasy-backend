import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { COURSE_DESCRIPTION_PROMPT, COURSE_BENEFITS_PROMPT } from '../utils/prompts.js';

const gemini = new Hono();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// CORS middleware
gemini.use('*', cors());

// List available models (temporary for debugging)
gemini.get('/models', async (c) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json() as any;

    return c.json({
      success: true,
      models: data.models || []
    });
  } catch (error: any) {
    console.error('Error listing models:', error);
    return c.json({
      error: 'Failed to list models',
      details: error.message
    }, 500);
  }
});

// Generate course description
gemini.post('/generate-description', async (c) => {
  try {
    const { title, level, icon } = await c.req.json();

    if (!title || !level) {
      return c.json({ error: 'Title and level are required' }, 400);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = COURSE_DESCRIPTION_PROMPT(title, level, icon);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();

    return c.json({
      success: true,
      description: description.trim()
    });
  } catch (error: any) {
    console.error('Error generating description:', error);
    return c.json({
      error: 'Failed to generate description',
      details: error.message
    }, 500);
  }
});

// Generate course benefits
gemini.post('/generate-benefits', async (c) => {
  try {
    const { title, level, description, icon } = await c.req.json();

    if (!title || !level) {
      return c.json({ error: 'Title and level are required' }, 400);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = COURSE_BENEFITS_PROMPT(title, level, description, icon);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const benefitsText = response.text();

    // Parse the JSON response
    let benefits;
    try {
      benefits = JSON.parse(benefitsText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = benefitsText.match(/\[.*?\]/s);
      if (jsonMatch) {
        benefits = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from Gemini');
      }
    }

    return c.json({
      success: true,
      benefits: benefits
    });
  } catch (error: any) {
    console.error('Error generating benefits:', error);
    return c.json({
      error: 'Failed to generate benefits',
      details: error.message
    }, 500);
  }
});

export default gemini;
