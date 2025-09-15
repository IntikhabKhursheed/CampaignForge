# Overview

CampaignPro is a comprehensive marketing campaign management application built with a full-stack TypeScript architecture. The application provides entrepreneurs and marketing teams with tools to create, manage, and analyze email, social media, and content marketing campaigns. It features a modern React frontend with shadcn/ui components, an Express.js backend with RESTful APIs, and PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing with a single-page application structure
- **Form Handling**: React Hook Form with Zod schema validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with consistent JSON responses
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Session Management**: Express session handling with connect-pg-simple for PostgreSQL session storage

## Database Architecture
- **Primary Database**: PostgreSQL with Neon serverless integration
- **Schema Management**: Drizzle Kit for database migrations and schema generation
- **Data Models**: Five core entities (users, campaigns, contacts, tasks, activities) with proper foreign key relationships
- **Type Safety**: Shared TypeScript schemas using Drizzle-Zod for consistent validation across frontend and backend

## Development Environment
- **Bundling**: Vite for frontend development with hot module replacement
- **Development Server**: Concurrent Express server handling both API routes and static file serving
- **Build Process**: Separate frontend (Vite) and backend (esbuild) build pipelines
- **Path Aliases**: Configured TypeScript path mapping for clean imports (@/ for client, @shared for shared code)

## Authentication & Security
- **User Management**: Simple username/password authentication with a default "founder" user
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Data Validation**: Zod schemas for runtime type checking and input sanitization

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: WebSocket connection for real-time database features

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system variables
- **Radix UI**: Unstyled, accessible UI component primitives
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for data visualization and analytics

## Development Tools
- **Replit Integration**: Development environment support with runtime error overlays
- **TypeScript**: Full type safety across the entire application stack
- **ESLint/Prettier**: Code formatting and linting (configured via package.json)

## Build & Runtime
- **esbuild**: Fast JavaScript bundler for production backend builds
- **ws**: WebSocket library for real-time features
- **date-fns**: Date manipulation and formatting utilities