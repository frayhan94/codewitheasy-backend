import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { corsMiddleware } from './middleware/cors.js';
import { authMiddleware } from './middleware/auth.js';
import courses from './routes/courses.js';
import modules from './routes/modules.js';
import lessons from './routes/lessons.js';
import users from './routes/users.js';
import enrollments from './routes/enrollments.js';
import subscriptions from './routes/subscriptions.js';
import certificates from './routes/certificates.js';
import lessonProgress from './routes/lesson-progress.js';
import gemini from './routes/gemini.js';
import openai from './routes/openAI.js';
import lessonFeedback from './routes/lesson-feedback.js';

const app = new Hono();

app.use('*', corsMiddleware);

app.get('/', (c) => {
  return c.json({
    message: 'CodeWithEasy Admin API',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      modules: '/api/modules',
      lessons: '/api/lessons',
      users: '/api/users',
      enrollments: '/api/enrollments',
      subscriptions: '/api/subscriptions',
      certificates: '/api/certificates',
      lessonProgress: '/api/lesson-progress',
      gemini: '/api/gemini',
      openai: '/api/openai'
    }
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply authentication middleware to all API routes
app.use('/api/*', authMiddleware);

app.route('/api/courses', courses);
app.route('/api/modules', modules);
app.route('/api/lessons', lessons);
app.route('/api/users', users);
app.route('/api/enrollments', enrollments);
app.route('/api/subscriptions', subscriptions);
app.route('/api/certificates', certificates);
app.route('/api/lesson-progress', lessonProgress);
app.route('/api/gemini', gemini);
app.route('/api/openai', openai);
app.route('/api/lesson-feedback', lessonFeedback);

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

if (process.env.NODE_ENV !== 'production') {
  const port = parseInt(process.env.PORT || '3000');
  
  serve({
    fetch: app.fetch,
    port,
  });
  
  console.log(`🚀 Server running on http://localhost:${port}`);
}

export default app;
