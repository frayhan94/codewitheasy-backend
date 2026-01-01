// Gemini AI Prompts for Course Generation

export const COURSE_DESCRIPTION_PROMPT = (title: string, level: string, icon?: string) => `Generate a compelling course description for a programming course with the following details:

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

export const COURSE_BENEFITS_PROMPT = (title: string, level: string, description?: string, icon?: string) => `Generate 5-7 key benefits for a programming course with the following details:

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
