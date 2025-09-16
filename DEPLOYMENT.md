# CampaignForge Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Fork/clone this repository to your GitHub account
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your CampaignForge repository
4. Configure environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB`: Your database name
   - `SESSION_SECRET`: Random string for session security
   - `CORS_ORIGIN`: Your frontend URL (auto-configured by Vercel)
5. Deploy automatically

### Option 2: Netlify
1. Visit [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "New site from Git" and select your repository
3. Build settings are auto-configured via `netlify.toml`
4. Add environment variables in Netlify dashboard
5. Deploy automatically

### Option 3: Railway
1. Visit [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your CampaignForge repository
4. Railway will auto-detect and deploy both frontend and backend
5. Configure environment variables in Railway dashboard

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=your-database-name
PORT=3000
SESSION_SECRET=your-random-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.development)
```
VITE_API_BASE=http://localhost:3000
```

### Frontend (.env.production)
```
VITE_API_BASE=https://your-backend-domain.com
```

## Database Setup

Configure your MongoDB connection in the server `.env` file:
- URI: `your-mongodb-connection-string`
- Database: `your-database-name`

To seed the database with sample data:
```bash
cd server
npm run seed
```

## Local Development

1. Install dependencies:
```bash
# Install client dependencies
cd client && npm install

# Install server dependencies  
cd ../server && npm install
```

2. Start development servers:
```bash
# Terminal 1 - Start backend
cd server && npm run dev

# Terminal 2 - Start frontend
cd client && npm run dev
```

3. Visit `http://localhost:5173` for the frontend

## Production Build

```bash
# Build client
cd client && npm run build

# Build server
cd server && npm run build

# Start production server
cd server && npm start
```

## Features Included

✅ **Full-stack TypeScript application**
✅ **MongoDB Atlas database integration**
✅ **Session-based authentication**
✅ **Campaign management with metrics**
✅ **Contact management with lead scoring**
✅ **Task management with priorities**
✅ **Analytics dashboard with charts**
✅ **Responsive design with Tailwind CSS**
✅ **Data persistence (localStorage + MongoDB)**
✅ **Activity tracking and logging**

## Demo Mode

The application includes a demo mode with localStorage persistence for development/testing without database setup. Toggle in `client/src/lib/queryClient.ts`:

```typescript
const DEMO_MODE = false; // Set to true for demo mode
```

## Support

For issues or questions, check the GitHub repository: https://github.com/IntikhabKhursheed/CampaignForge
