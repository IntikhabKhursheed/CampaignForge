# CampaignForge

A modern campaign management platform built with React, TypeScript, and Node.js. Features session-based authentication, MongoDB integration, and a responsive UI.

## Features

- 🔐 **Session-based Authentication** - Secure login/register with route protection
- 📊 **Dashboard** - Campaign metrics and analytics overview
- 🎯 **Campaign Management** - Create and manage marketing campaigns
- 👥 **Contact Management** - Organize and track leads
- ✅ **Task Management** - Track campaign-related tasks
- 📈 **Analytics** - Performance insights and reporting

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and building
- TanStack Query for data fetching
- Wouter for routing
- Tailwind CSS + shadcn/ui components

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with native driver
- Session-based authentication
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CampaignForge.git
cd CampaignForge
```

### 2. Environment Configuration

#### Server Environment
Copy the server environment template:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/your-database
MONGODB_DB=CampaignForge

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration (CHANGE THIS IN PRODUCTION!)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### Client Environment
Copy the client environment template:
```bash
cp client/.env.example client/.env.development
```

Edit `client/.env.development`:
```env
# Backend API Configuration
VITE_API_BASE=http://localhost:3000
```

### 3. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd ../client
npm install
```

### 4. Start Development Servers

#### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```
Server will start on http://localhost:3000

#### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```
Client will start on http://localhost:5173

### 5. Access the Application

1. Open http://localhost:5173 in your browser
2. You'll be redirected to the login page
3. Click "Create one" to register a new account
4. After registration, you'll be logged in and redirected to the dashboard

## Production Deployment

### Environment Variables for Production

**Server (.env):**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
MONGODB_DB=CampaignForge
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-very-secure-random-string-min-32-chars
CORS_ORIGIN=https://your-frontend-domain.com
```

**Client (.env.production):**
```env
VITE_API_BASE=https://your-api-domain.com
```

### Build for Production

#### Build Client
```bash
cd client
npm run build
```

#### Build Server (if needed)
```bash
cd server
npm run build  # if you have a build script
```

### Deploy Options

1. **Vercel/Netlify** (Frontend) + **Railway/Render** (Backend)
2. **Docker** containers
3. **VPS** with PM2 process manager

## Project Structure

```
CampaignForge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (auth, etc.)
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Route components
│   │   └── App.tsx         # Main app component
│   ├── .env.example        # Environment template
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # MongoDB operations
│   ├── index.ts            # Express server setup
│   ├── .env.example        # Environment template
│   └── package.json
├── shared/                 # Shared TypeScript types
│   └── models.ts           # Zod schemas and types
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current user info

### Campaigns
- `GET /api/campaigns` - List user's campaigns
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Contacts
- `GET /api/contacts` - List user's contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Tasks
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Analytics
- `GET /api/dashboard/metrics` - Dashboard overview data
- `GET /api/activities` - Recent activity feed

## Security Features

- Session-based authentication with httpOnly cookies
- CORS protection with configurable origins
- Input validation using Zod schemas
- Route protection on both client and server
- Environment variable isolation

## Development

### Adding New Features

1. **Backend**: Add routes in `server/routes.ts` and database operations in `server/storage.ts`
2. **Frontend**: Create components in `client/src/components/` and pages in `client/src/pages/`
3. **Shared**: Update types in `shared/models.ts` for data validation

### Database Schema

The app uses MongoDB with collections:
- `users` - User accounts and authentication
- `campaigns` - Marketing campaigns
- `contacts` - Lead and contact information  
- `tasks` - Campaign-related tasks
- `activities` - Activity feed/audit log

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to your fork: `git push origin feature-name`
6. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include environment details and error logs

---

**Happy campaigning! 🚀**
