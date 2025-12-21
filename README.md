# 🚀 CodeWithEasy Admin Backend API

Hono-based backend API for the CodeWithEasy admin panel. Deployed on Vercel.

## 📋 Features

- ✅ RESTful API for all admin resources
- ✅ Supabase integration with service_role key (secure backend access)
- ✅ CORS support for frontend
- ✅ TypeScript support
- ✅ Authentication middleware (optional)
- ✅ Vercel-ready deployment
- ✅ Fast and lightweight (Hono framework)

## 🗂️ API Endpoints

All endpoints are prefixed with `/api`

### **Courses** (`/api/courses`)
- `GET /api/courses` - List all courses (with pagination)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### **Modules** (`/api/modules`)
- `GET /api/modules` - List all modules
- `GET /api/modules/:id` - Get single module
- `POST /api/modules` - Create module
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### **Lessons** (`/api/lessons`)
- `GET /api/lessons` - List all lessons
- `GET /api/lessons/:id` - Get single lesson
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### **Users** (`/api/users`)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### **Enrollments** (`/api/enrollments`)
- `GET /api/enrollments` - List all enrollments
- `GET /api/enrollments/:id` - Get single enrollment
- `POST /api/enrollments` - Create enrollment
- `PUT /api/enrollments/:id` - Update enrollment
- `DELETE /api/enrollments/:id` - Delete enrollment

### **Subscriptions** (`/api/subscriptions`)
- `GET /api/subscriptions` - List all subscriptions
- `GET /api/subscriptions/:id` - Get single subscription
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### **Certificates** (`/api/certificates`)
- `GET /api/certificates` - List all certificates
- `GET /api/certificates/:id` - Get single certificate
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/:id` - Update certificate
- `DELETE /api/certificates/:id` - Delete certificate

### **Lesson Progress** (`/api/lesson-progress`)
- `GET /api/lesson-progress` - List all lesson progress
- `GET /api/lesson-progress/:id` - Get single lesson progress
- `POST /api/lesson-progress` - Create lesson progress
- `PUT /api/lesson-progress/:id` - Update lesson progress
- `DELETE /api/lesson-progress/:id` - Delete lesson progress

### **Utility Endpoints**
- `GET /` - API info
- `GET /health` - Health check

## 🚀 Local Development

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your credentials:

```env
SUPABASE_URL=https://xddwjezateblcsjecljs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ALLOWED_ORIGINS=http://localhost:5174,http://localhost:5173
```

**Get your service_role key:**
1. Go to https://app.supabase.com/project/xddwjezateblcsjecljs/settings/api
2. Find "service_role" key under Project API keys
3. Click "Reveal" and copy

### 3. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### 4. Test API

```bash
# Health check
curl http://localhost:3000/health

# Get courses
curl http://localhost:3000/api/courses

# Get single course
curl http://localhost:3000/api/courses/1
```

## 📦 Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd backend
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your repository
5. Set root directory to `backend`
6. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ALLOWED_ORIGINS`
7. Deploy

### Environment Variables on Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL=https://xddwjezateblcsjecljs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ALLOWED_ORIGINS=https://your-admin-domain.vercel.app
```

## 🔧 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main app entry
│   ├── lib/
│   │   └── supabase.ts       # Supabase client
│   ├── middleware/
│   │   ├── cors.ts           # CORS middleware
│   │   └── auth.ts           # Auth middleware (optional)
│   └── routes/
│       ├── courses.ts        # Course routes
│       ├── modules.ts        # Module routes
│       ├── lessons.ts        # Lesson routes
│       ├── users.ts          # User routes
│       ├── enrollments.ts    # Enrollment routes
│       ├── subscriptions.ts  # Subscription routes
│       ├── certificates.ts   # Certificate routes
│       └── lesson-progress.ts # Lesson progress routes
├── package.json
├── tsconfig.json
├── vercel.json
└── .env
```

## 🔐 Security

### Service Role Key
- ✅ Only used on backend (secure)
- ✅ Has full database access
- ✅ Never exposed to frontend
- ⚠️ Keep it secret in environment variables

### CORS
- Configured to allow only your admin frontend domain
- Update `ALLOWED_ORIGINS` in production

### Authentication (Optional)
- Auth middleware is available but not enabled by default
- To enable, add to routes:
  ```typescript
  app.use('/api/*', authMiddleware);
  ```

## 📊 Response Format

### Success Response
```json
{
  "data": [...],
  "total": 100
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## 🐛 Troubleshooting

### Error: Missing environment variables
**Solution:** Check `.env` file has all required variables

### Error: CORS blocked
**Solution:** Add your frontend URL to `ALLOWED_ORIGINS`

### Error: Database connection failed
**Solution:** Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct

## 📚 Tech Stack

- **Framework:** Hono (ultra-fast web framework)
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript
- **Deployment:** Vercel
- **Runtime:** Node.js

## 🔗 Related Documentation

- [Hono Documentation](https://hono.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

**Need help?** Check the main [project README](../README.MD) or open an issue.
