# Hoops Prospect Backend API

A Node.js/Express backend for the Hoops Prospect recruiting platform.

## Quick Start

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb hoops_prospect
```

### 2. Setup Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Update DB_PASSWORD with your PostgreSQL password
```

### 3. Install Dependencies & Start
```bash
npm install
npm run migrate    # Creates database tables
npm run seed      # Adds sample data
npm run dev       # Starts development server
```

## API Endpoints

- **Health Check**: `GET /health`
- **API Info**: `GET /api`
- **Athletes**: `GET/POST/PUT/DELETE /api/athletes`
- **Videos**: `GET/POST/DELETE /api/videos`
- **Teams**: `GET/POST/PUT /api/teams`
- **Auth**: `POST /api/auth/login`

## Development Commands

```bash
npm run dev        # Start development server
npm run start      # Start production server
npm run migrate    # Run database migrations
npm run seed       # Seed database with sample data
npm run reset-db   # Reset database (development only)
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── config/        # Database config
│   └── utils/         # Helper functions
├── scripts/           # Database scripts
├── uploads/          # File uploads
└── server.js         # Main server file
```

## Database Schema

- **users** - Authentication and user management
- **teams** - Team information
- **athletes** - Player profiles and details
- **videos** - Video content and metadata
- **statistics** - Player performance stats

## Features

✅ Express.js REST API
✅ PostgreSQL database with migrations
✅ File upload handling
✅ Authentication with JWT
✅ Input validation
✅ Error handling
✅ Rate limiting
✅ Security headers
✅ API documentation