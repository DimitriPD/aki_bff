# Quick Start Guide - AKI! BFF

This guide will help you get the BFF running locally in under 5 minutes.

## ⚡ Quick Setup

### 1. Prerequisites Check

```bash
# Check Node.js version (should be >= 20)
node --version

# Check npm
npm --version
```

### 2. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/aki_bff.git
cd aki_bff

# Install dependencies
npm install
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# For local development with mock services, use these settings:
```

**.env for local development:**
```env
PORT=4000
NODE_ENV=development
LOG_LEVEL=info

# Mock authentication (no real auth required)
MOCK_AUTH_ENABLED=true
MOCK_TEACHER_ID=1

# Use production microservices (or replace with local URLs)
PERSONAS_BASE_URL=https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net
CORE_BASE_URL=https://aki-microservice-core-eta6esbzc5d9hze0.eastus2-01.azurewebsites.net
FUNCTION_PASSWORD_URL=https://aki-send-password-email-c8dcdae0bebab5br.eastus2-01.azurewebsites.net
FUNCTION_NOTIFICATION_URL=https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net

JWT_SECRET=dev_secret_key
REQUEST_TIMEOUT_MS=8000
```

### 4. Run the BFF

```bash
# Development mode (with auto-reload)
npm run dev
```

You should see:
```
🚀 BFF Server running on port 4000
📡 Connected services:
   personas: https://aki-microservice-personas-...
   core: https://aki-microservice-core-...
🔐 Authentication mode:
   mockEnabled: true
```

### 5. Test the Server

**Health Check:**
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T...",
  "service": "aki-bff",
  "version": "1.0.0"
}
```

---

## 🧪 Test the API

### Test 1: Mock Login

```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "professor@example.com",
    "password": "password123"
  }'
```

You should get a JWT token in the response.

### Test 2: Get Professor Dashboard

Save the token from Test 1, then:

```bash
curl -X GET http://localhost:4000/v1/professor/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 3: Student Device Binding

```bash
curl -X POST http://localhost:4000/v1/student/device \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "device_id": "test-device-123"
  }'
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 4000 is already in use:
```bash
# Change PORT in .env
PORT=4001
```

### Cannot Connect to Microservices

Check if the URLs in `.env` are correct and accessible:
```bash
curl https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net/health
```

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

---

## 📂 Project Structure Overview

```
aki_bff/
├── src/
│   ├── application/        # Business logic (use-cases)
│   ├── domain/            # Entities, DTOs, interfaces
│   ├── infrastructure/    # HTTP clients, config
│   ├── interface/         # Controllers, routes, middleware
│   ├── shared/            # Errors, logger, utilities
│   └── index.ts           # Main entry point
├── .env                   # Your configuration (not in git)
└── package.json           # Dependencies
```

---

## 🚀 Next Steps

1. **Read the full README**: [README.md](README.md)
2. **Explore the API**: Try all endpoints from the documentation
3. **Check the architecture**: [STRUCTURE.md](STRUCTURE.md)
4. **Review Swagger specs**: See `docs/` folder
5. **Start building**: Add your own features!

---

## 💡 Common Development Commands

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔗 Useful Links

- **Main Documentation**: [README.md](README.md)
- **Architecture Details**: [STRUCTURE.md](STRUCTURE.md)
- **API Specs**: `docs/AKI! - BFF (Backend For Frontend) - Swagger.yaml`
- **Microservice Specs**: `docs/` folder

---

**Need help? Check the full README or contact the team!**
