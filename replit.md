# Catch Items Web3 Game

## Overview

This is a Web3-enabled catching game built as a Farcaster mini app on the Base Network. Players catch falling emoji items using a basket controlled by mouse/touch input, competing for high scores while connected via MetaMask or OKX wallets. The application features a modern gaming interface with dark/light modes, real-time gameplay, leaderboards, and guest play options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter (lightweight client-side routing)
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and TanStack Query for server state

**Design System:**
- Custom Tailwind configuration with extended color palette using HSL color variables
- Typography system featuring Inter (UI), JetBrains Mono (monospace elements), and Space Grotesk (display text)
- Component library based on shadcn/ui "new-york" style with extensive Radix UI primitives
- Dark mode support with theme toggle functionality
- Gaming-focused aesthetics inspired by Axie Infinity, Duolingo, Discord, and Coinbase Wallet

**Game Logic:**
- Browser-based canvas/DOM manipulation for falling items animation
- Real-time basket positioning via mouse/touch events
- Score tracking with missed items counter
- Client-side game state management using React refs and intervals

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API routes
- HTTP server creation with potential WebSocket support
- Development mode with Vite middleware integration
- Production static file serving

**Storage Layer:**
- In-memory storage implementation (MemStorage class) for development
- Prepared for PostgreSQL integration via Drizzle ORM
- User schema defined with username/password fields
- UUID-based primary keys

**API Design:**
- RESTful endpoints prefixed with `/api`
- JSON request/response handling
- Session management preparation via connect-pg-simple
- Request logging middleware for API routes

### Web3 Integration

**Blockchain Connection:**
- Base Network (Chain ID: 0x2105) as primary blockchain
- MetaMask and OKX Wallet support for wallet connectivity
- Custom wallet detection and connection flow
- Network switching capabilities to Base mainnet

**Farcaster Mini App:**
- Integration with @farcaster/miniapp-sdk (installed November 2025)
- SDK initialization via `sdk.actions.ready()` in App.tsx to hide loading splash
- Buffer polyfill added to main.tsx for browser compatibility
- Mini app manifest at `client/public/.well-known/farcaster.json` following Farcaster documentation
- fc:miniapp metadata in index.html for rich embeds
- Required chain: Base Network (eip155:8453)
- Manifest includes app metadata: name, description, icons, screenshots, and categorization
- Account association fields ready for ownership verification via Farcaster Developer Tools

### External Dependencies

**Third-Party Services:**
- **Farcaster Platform**: Mini app hosting and distribution
- **Base Network**: Layer 2 Ethereum blockchain for Web3 functionality
- **Wallet Providers**: MetaMask and OKX for cryptocurrency wallet integration

**Database:**
- **Neon Database**: Serverless PostgreSQL (@neondatabase/serverless)
- Connection pooling and serverless-optimized queries
- Drizzle ORM for type-safe database operations
- Migration system via drizzle-kit

**UI Libraries:**
- **Radix UI**: Headless component primitives (30+ components including Dialog, Dropdown, Toast, etc.)
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with Zod validation

**Development Tools:**
- **Replit Plugins**: Cartographer and dev banner for Replit environment
- **TypeScript**: Type safety across client, server, and shared code
- **ESBuild**: Server-side bundling for production
- **PostCSS/Autoprefixer**: CSS processing pipeline

**Deployment:**
- Configured for Vercel deployment with custom build settings
- Static asset serving from `dist/public`
- SPA routing via rewrites to index.html
- Environment variable support for database and API configuration