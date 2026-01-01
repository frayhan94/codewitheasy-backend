import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini = new Hono();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// CORS middleware
gemini.use('*', cors());

// Generate course description
gemini.post('/generate-description', async (c) => {
  try {
    const { title, level, icon } = await c.req.json();

    if (!title || !level) {
      return c.json({ error: 'Title and level are required' }, 400);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a compelling course description for a programming course with the following details:

Title: ${title}
Level: ${level}
${icon ? `Icon/Theme: ${icon}` : ''}

Requirements:
- Write in a professional yet engaging tone
- Keep it between 100-150 words
- Highlight what students will learn
- Mention target audience (beginner/intermediate/advanced)
- Include key skills they'll acquire
- Make it inspiring and action-oriented
- Avoid overly technical jargon
- Focus on practical outcomes

Format: Return only the description text, no additional formatting or explanations.`;

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

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate 5-7 key benefits for a programming course with the following details:

Title: ${title}
Level: ${level}
${description ? `Description: ${description}` : ''}
${icon ? `Icon/Theme: ${icon}` : ''}

Requirements:
- Benefits should be concise and impactful
- Focus on practical skills and career outcomes
- Use action-oriented language
- Each benefit should be 5-15 words
- Include both technical and soft skills
- Make them appealing to the target audience
- Avoid generic statements

Format: Return ONLY a valid JSON array of strings, like:
["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4", "Benefit 5"]

Do not include any additional text, explanations, or formatting outside the JSON array.`;

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
