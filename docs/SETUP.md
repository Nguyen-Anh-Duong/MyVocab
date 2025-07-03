# 🚀 MyVocab Backend - Quick Setup Guide

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **Redis** (v6.0 or higher)
- **Git**

## Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/myvocab-backend.git
cd myvocab-backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (see instructions below)
nano .env  # or use your preferred editor
```

### 3. Required Environment Variables

Open `.env` and update these **mandatory** values:

```env
# JWT Secrets - MUST CHANGE in production
ACCESS_TOKEN_SECRET_KEY=your-super-secret-access-token-key-HERE
REFRESH_TOKEN_SECRET_KEY=your-super-secret-refresh-token-key-HERE

# Email Service (for user verification)
RESEND_API_KEY=your-resend-api-key-HERE

# Database (update if using different ports/hosts)
MONGO_URI=mongodb://localhost:27017/myvocab
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup

```bash
# Start MongoDB (if not running)
sudo systemctl start mongod
# OR if using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start Redis (if not running)
sudo systemctl start redis
# OR if using Docker:
docker run -d -p 6379:6379 --name redis redis:latest
```

### 5. Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 7. Verify Installation

- **API Server**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000 (should show "MyVocab API Server")

## 🔧 Development Tools

### Available Scripts

```bash
npm run dev          # Start development server with auto-reload
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
npm run prettier     # Check code formatting
npm run prettier:fix # Fix code formatting
```

### VS Code Setup

Install recommended extensions:

- ESLint
- Prettier
- TypeScript

### Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug MyVocab API",
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

## 🧪 Testing the API

### Option 1: Swagger UI (Recommended)

1. Open http://localhost:3000/api-docs
2. Click "Try it out" on any endpoint
3. For protected endpoints:
   - First register/login to get access token
   - Click "Authorize" button
   - Enter `Bearer <your-token>`

### Option 2: Postman Collection

1. Import `docs/api-collection.json` into Postman
2. Set environment variables:
   - `baseUrl`: http://localhost:3000/api/v1
   - `accessToken`: (will be auto-filled after login)

### Option 3: cURL Examples

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get user profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer TOKEN"
```

## 🚨 Troubleshooting

### Common Issues

**MongoDB Connection Error**

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Redis Connection Error**

```bash
# Check if Redis is running
sudo systemctl status redis

# Start Redis
sudo systemctl start redis
```

**Port Already in Use**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Environment Variables Not Loading**

- Make sure `.env` file exists in project root
- Check file permissions: `chmod 644 .env`
- Restart the server after changing `.env`

### Email Issues

**Email not sending**

- Verify Resend API key is correct
- Check Resend dashboard for sending limits
- For development, emails might go to spam folder

### Database Issues

**MongoDB connection timeout**

- Check MongoDB is accessible: `mongo --eval "db.stats()"`
- Verify MONGO_URI format: `mongodb://host:port/database`

**Redis connection failed**

- Test Redis connection: `redis-cli ping`
- Should return "PONG"

## 📚 Next Steps

1. **Read the full documentation**: [README.md](../README.md)
2. **Explore the API**: http://localhost:3000/api-docs
3. **Check project structure**: Understand the codebase organization
4. **Set up the frontend**: Connect your frontend application
5. **Deploy to production**: Follow deployment guides

## 💡 Tips

- Use environment-specific `.env` files (`.env.dev`, `.env.prod`)
- Enable auto-save in your editor for faster development
- Use Git hooks for code quality (ESLint, Prettier)
- Monitor logs in development: `npm run dev | tee app.log`

## 🆘 Need Help?

- **Documentation**: [README.md](../README.md)
- **API Reference**: http://localhost:3000/api-docs
- **Issues**: Create a GitHub issue
- **Email**: support@myvocab.com

---

Happy coding! 🎉
