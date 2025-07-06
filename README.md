# MyVocab - Vocabulary Learning Application Backend

A comprehensive vocabulary learning application backend built with Node.js, Express, TypeScript, and MongoDB.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Authentication & Authorization

- User registration with email verification
- JWT-based authentication (Access + Refresh tokens)
- Secure logout from single device or all devices
- Session management with Redis

### Vocabulary Management

- Create, read, update, delete vocabularies
- Rich vocabulary data structure with:
  - Phonetic transcription and audio
  - Multiple meanings with examples
  - Part of speech classification
  - Common phrases
  - Context-aware definitions
- Full-text search capabilities

### Category Management

- Create and organize vocabularies into categories
- Category statistics and analytics
- Color-coded category system
- Search and filter categories

### User Management

- User profile management
- Personal vocabulary collections
- Multi-tenant architecture (user-isolated data)

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache/Session**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **Email**: Resend
- **Security**: Helmet, CORS
- **Development**: Nodemon, ESLint, Prettier

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (v5.0 or higher)
- Redis (v6.0 or higher)

## ⚡ Quick Setup

For a quick start, see our detailed setup guide: **[docs/SETUP.md](docs/SETUP.md)**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/myvocab-backend.git
   cd myvocab-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables))

4. **Start MongoDB and Redis**

   ```bash
   # MongoDB (if running locally)
   mongod

   # Redis (if running locally)
   redis-server
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

Then configure the following variables:

### Server Configuration

```env
PORT=3000                    # Port for the application (default: 3000)
NODE_ENV=development         # Environment: development, production, test
APP_URL=http://localhost:3000 # Base URL of your application
```

### Database Configuration

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/myvocab  # MongoDB connection string
MONGO_INITDB_ROOT_USERNAME=                  # MongoDB root username (optional for local)
MONGO_INITDB_ROOT_PASSWORD=                  # MongoDB root password (optional for local)
MONGO_DB_NAME=myvocab                        # Database name

# Redis Configuration
REDIS_URL=redis://localhost:6379             # Redis connection string
```

### Security & Authentication

```env
# Password Hashing
SALT_LENGTH=16               # Length of salt for password hashing (bytes)
KEY_LENGTH=64                # Length of hash for password hashing (bytes)

# JWT Tokens (MUST CHANGE in production)
ACCESS_TOKEN_SECRET_KEY=your_jwt_secret_change_this_in_production
REFRESH_TOKEN_SECRET_KEY=refresh_secret_key_change_this_in_production
```

### External Services

```env
# Email Service (Get free API key from resend.com)
RESEND_API_KEY=your_resend_api_key_here

# Google Gemini AI (Get API key from ai.google.dev)
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth (Get from Google Cloud Console)
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

### Important Notes

⚠️ **Security Warnings:**

- **NEVER** commit your actual `.env` file to version control
- **ALWAYS** change JWT secrets in production (use long, random strings)
- Keep your API keys secure and never expose them publicly

📝 **Setup Instructions:**

1. **MongoDB**: Install locally or use MongoDB Atlas (cloud)
2. **Redis**: Install locally or use Redis Cloud
3. **Resend API**: Sign up at [resend.com](https://resend.com) for email functionality
4. **Gemini API**: Get API key from [ai.google.dev](https://ai.google.dev) for AI features
5. **Google OAuth**: Set up in [Google Cloud Console](https://console.cloud.google.com) for Google login

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Other Commands

```bash
# Linting
npm run lint
npm run lint:fix

# Code Formatting
npm run prettier
npm run prettier:fix
```

## 📖 API Documentation

The API documentation is available via Swagger UI:

- **Development**: http://localhost:3000/api-docs
- **Production**: https://your-domain.com/api-docs

### API Base URL

- Development: `http://localhost:3000/api/v1`
- Production: `https://your-domain.com/api/v1`

### Authentication

The API uses Bearer token authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

### Testing the API

1. **Swagger UI** (Recommended): http://localhost:3000/api-docs
2. **Postman Collection**: Import `docs/api-collection.json`
3. **cURL Examples**: See [docs/SETUP.md](docs/SETUP.md)

### Main Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/verify-email` - Verify email address
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout from current device
- `POST /auth/logout-all` - Logout from all devices
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password for authenticated user

#### Google OAuth

- `GET /auth/google` - Get Google OAuth authorization URL
- `GET /auth/google/callback` - Handle Google OAuth callback

#### Users

- `GET /users/me` - Get current user profile
- `GET /users` - Get all users (Admin only)
- `GET /users/{userId}` - Get user by ID (Admin only)
- `PATCH /users/{userId}` - Update user (Admin only)
- `PATCH /users/{userId}/status` - Update user status (Admin only)
- `DELETE /users/{userId}` - Delete user (Admin only)

#### Vocabularies

- `GET /vocabularies` - Get all user vocabularies
- `POST /vocabularies` - Create new vocabulary
- `GET /vocabularies/{id}` - Get vocabulary by ID
- `PATCH /vocabularies/{id}` - Update vocabulary
- `DELETE /vocabularies/{id}` - Delete vocabulary
- `GET /vocabularies/search` - Search vocabularies

#### Categories

- `GET /categories` - Get all user categories
- `POST /categories` - Create new category
- `GET /categories/{id}` - Get category by ID
- `PATCH /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category
- `GET /categories/stats` - Get category statistics
- `GET /categories/{id}/vocabularies` - Get vocabularies by category
- `GET /categories/search` - Search categories

#### NLP & AI Features

- `POST /nlp/text-to-vocabulary` - Parse text to extract vocabulary using AI (Google Gemini)

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts     # Environment variables
│   └── swagger.ts   # Swagger configuration
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── vocabulary.controller.ts
│   └── category.controller.ts
├── database/        # Database connections
│   ├── database.connect.ts
│   └── redis.connect.ts
├── dtos/            # Data Transfer Objects
│   ├── user.dto.ts
│   ├── vocabulary.dto.ts
│   ├── category.dto.ts
│   ├── email.dto.ts
│   ├── id.dto.ts
│   └── search.dto.ts
├── middlewares/     # Express middlewares
│   ├── authentication.ts
│   ├── validate.ts
│   └── errorHandler.ts
├── models/          # Mongoose models
│   ├── user.model.ts
│   ├── vocabulary.model.ts
│   ├── category.model.ts
│   └── verifyToken.model.ts
├── routes/          # Express routes
│   ├── api/
│   │   └── v1/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── vocabularies/
│   │       └── categories/
│   └── index.ts
├── services/        # Business logic services
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── vocabulary.service.ts
│   ├── category.service.ts
│   └── token.service.ts
├── utils/           # Utility functions
│   ├── catchAsync.ts
│   ├── Errors.ts
│   ├── hash.ts
│   ├── email.ts
│   └── user.utils.ts
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🔐 Authentication

The application uses a dual-token authentication system:

### Access Token

- **Purpose**: API authentication
- **Lifetime**: 15 minutes
- **Storage**: Client-side (memory/localStorage)
- **Usage**: Bearer token in Authorization header

### Refresh Token

- **Purpose**: Generate new access tokens
- **Lifetime**: 1 day
- **Storage**: HTTP-only cookie + Redis
- **Security**: Rotation on each use

### Session Management

- **Family Token**: Unique identifier for each login session
- **Redis Storage**: Refresh tokens stored with family ID
- **Logout**: Removes tokens from Redis
- **Logout All**: Removes all user tokens from Redis

## 🗄 Database Schema

### User Model

```typescript
interface IUser {
  _id: ObjectId
  email: string
  username: string
  passwordHash: string
  role: 'user' | 'admin'
  status: 'pending' | 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}
```

### Vocabulary Model

```typescript
interface IVocabulary {
  _id: ObjectId
  word: string
  phonetic?: {
    text?: string
    audio?: string
  }
  meanings: IMeaning[]
  categories: ObjectId[]
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

interface IMeaning {
  meaning: string
  context?: string
  partOfSpeech?: string
  note?: string
  examples?: IExample[]
  commonPhrases?: ICommonPhrase[]
}
```

### Category Model

```typescript
interface ICategory {
  _id: ObjectId
  name: string
  description?: string
  color?: string
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run prettier

# Fix formatting
npm run prettier:fix
```

### Debugging

The application supports VS Code debugging. Create a `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "ts-node": true,
      "env": {
        "NODE_ENV": "dev"
      }
    }
  ]
}
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t myvocab-backend .

# Run container
docker run -p 3000:3000 myvocab-backend
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help, please:

1. Check the [API documentation](http://localhost:3000/api-docs)
2. Open an issue on GitHub
3. Contact the development team

---

**Happy coding!** 🎉
