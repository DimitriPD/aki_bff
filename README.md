# AKI! BFF (Backend For Frontend)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Overview

The **AKI! BFF** is a Backend-for-Frontend service that acts as a single, optimized API gateway for the AKI! attendance system. It orchestrates communication between multiple microservices and serverless functions, providing aggregated, frontend-friendly endpoints for both Professor and Student user interfaces.

### Key Responsibilities

- **API Aggregation**: Combines data from Personas (SQL) and Core (MongoDB) microservices
- **Authentication & Authorization**: JWT-based auth with mock support for development
- **Data Transformation**: Converts backend responses into frontend-optimized formats
- **Orchestration**: Manages cross-service calls and error handling
- **Gateway**: Single entry point for all frontend requests

---

## 🏗️ Architecture

This project follows **Clean Architecture**, **SOLID principles**, and **Vertical Slice Architecture**:

```
src/
├── application/          # Business logic layer
│   └── use-cases/       # Feature-specific business logic
│       ├── auth/        # Authentication flows
│       ├── student/     # Student attendance operations
│       └── professor/   # Professor event management
├── domain/              # Core domain layer
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # Domain entities
│   └── interfaces/     # Contracts/interfaces
├── infrastructure/      # External services layer
│   ├── config/         # Configuration management
│   └── http/           # HTTP clients for external services
│       └── clients/    # Axios-based service clients
├── interface/           # Presentation layer
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   └── routes/         # Route definitions
├── shared/              # Shared utilities
│   ├── errors/         # Error handling
│   ├── logger/         # Logging utilities
│   └── utils/          # Helper functions
└── index.ts             # Application entry point
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- Access to AKI! microservices (Personas, Core, Functions)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/aki_bff.git
   cd aki_bff
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your service URLs and credentials
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=4000
NODE_ENV=development

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Microservices
PERSONAS_BASE_URL=https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net
CORE_BASE_URL=https://aki-microservice-core-eta6esbzc5d9hze0.eastus2-01.azurewebsites.net

# Azure Functions
FUNCTION_PASSWORD_URL=https://aki-send-password-email-c8dcdae0bebab5br.eastus2-01.azurewebsites.net
FUNCTION_NOTIFICATION_URL=https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net

# HTTP Client
REQUEST_TIMEOUT_MS=8000
MAX_RETRIES=2

# Mock (Development)
MOCK_AUTH_ENABLED=true
MOCK_TEACHER_ID=1
```

---

## 📡 API Endpoints

### Interactive Documentation (Swagger UI)

Access the complete API documentation with interactive testing at:
```
http://localhost:4000/docs
```

The Swagger UI provides:
- Complete API specification
- Interactive endpoint testing
- Request/response schemas
- Authentication support

### Health Check

```http
GET /health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T12:00:00.000Z",
  "service": "aki-bff",
  "version": "1.0.0"
}
```

---

### 🔐 Authentication Endpoints

#### Login (Mock)

```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "professor@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "teacher": {
      "id": 1,
      "full_name": "Mock Teacher",
      "email": "professor@example.com"
    }
  },
  "message": "Login successful"
}
```

#### Forgot Password

```http
POST /v1/auth/forgot-password
Content-Type: application/json

{
  "email": "professor@example.com"
}
```

#### Reset Password

```http
POST /v1/auth/reset-password
Content-Type: application/json

{
  "token": "recovery-token-here",
  "new_password": "newPassword123"
}
```

---

### 👨‍🎓 Student Endpoints

#### Bind Device

```http
POST /v1/student/device
Content-Type: application/json

{
  "cpf": "12345678901",
  "device_id": "device-uuid-123"
}
```

**Response**:
```json
{
  "data": {
    "status": "success",
    "message": "Device bound successfully",
    "student_id": 42
  },
  "message": "Device bound successfully"
}
```

#### Scan QR Code (Register Attendance)

```http
POST /v1/student/scan
Content-Type: application/json

{
  "qr_token": "eyJhbGciOiJIUzI1NiIs...",
  "device_id": "device-uuid-123",
  "student_cpf": "12345678901",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  }
}
```

**Response**:
```json
{
  "data": {
    "status": "success",
    "message": "Attendance registered successfully!",
    "attendance": {
      "id": "event123-student456",
      "event_id": "event123",
      "student_name": "João Silva",
      "timestamp": "2025-10-26T12:30:00.000Z",
      "within_radius": true
    }
  },
  "message": "Attendance registered successfully!"
}
```

---

### 👨‍🏫 Professor Endpoints

All professor endpoints require **JWT authentication** via `Authorization: Bearer <token>` header.

#### Get Dashboard

```http
GET /v1/professor/dashboard
Authorization: Bearer <token>
```

**Response**:
```json
{
  "data": {
    "teacher": {
      "id": 1,
      "full_name": "Prof. Maria Silva",
      "email": "maria@example.com"
    },
    "classes": [
      {
        "id": 101,
        "name": "Turma A - Matemática",
        "student_count": 30
      }
    ],
    "upcoming_events": [],
    "recent_occurrences": [],
    "stats": {
      "total_events": 0,
      "total_attendances": 0,
      "total_occurrences": 0
    }
  },
  "message": "Dashboard data retrieved successfully"
}
```

#### Create Event

```http
POST /v1/professor/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "class_id": 101,
  "teacher_id": 1,
  "start_time": "2025-10-26T14:00:00Z",
  "end_time": "2025-10-26T16:00:00Z",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  }
}
```

**Response**:
```json
{
  "data": {
    "id": "67123abc456def789",
    "class_id": 101,
    "class_name": "Turma A - Matemática",
    "teacher_id": 1,
    "teacher_name": "Prof. Maria Silva",
    "start_time": "2025-10-26T14:00:00Z",
    "end_time": "2025-10-26T16:00:00Z",
    "location": {
      "latitude": -23.550520,
      "longitude": -46.633308
    },
    "qr_token": "eyJhbGciOiJIUzI1NiIs...",
    "status": "active",
    "created_at": "2025-10-26T12:00:00Z",
    "updated_at": "2025-10-26T12:00:00Z"
  },
  "message": "Event created successfully"
}
```

#### Get Event

```http
GET /v1/professor/events/:eventId
Authorization: Bearer <token>
```

#### Update Event

```http
PUT /v1/professor/events/:eventId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

#### Delete Event

```http
DELETE /v1/professor/events/:eventId
Authorization: Bearer <token>
```

#### Get Event QR Code

```http
GET /v1/professor/events/:eventId/qr
Authorization: Bearer <token>
```

---

## 🔌 Integration Overview

### Connected Services

| Service | Purpose | Base URL (Production) |
|---------|---------|----------------------|
| **Personas** | Students, Teachers, Classes (SQL) | https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net |
| **Core** | Events, Attendances, Occurrences (MongoDB) | https://aki-microservice-core-eta6esbzc5d9hze0.eastus2-01.azurewebsites.net |
| **Function (Password)** | Password recovery emails | https://aki-send-password-email-c8dcdae0bebab5br.eastus2-01.azurewebsites.net |
| **Function (Notification)** | Institution notifications | https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net |

### HTTP Client Features

- ✅ Automatic retries on 5xx errors
- ✅ Configurable timeouts
- ✅ Correlation ID tracking
- ✅ Request/Response logging
- ✅ Error mapping and transformation

---

## 🛠️ Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

### Adding a New Feature (Vertical Slice)

1. **Create use-case** in `src/application/use-cases/<feature>/`
2. **Add validation schema** in same folder
3. **Create controller** in `src/interface/controllers/`
4. **Define routes** in `src/interface/routes/`
5. **Register routes** in `src/index.ts`

Example structure for a new feature:
```
src/application/use-cases/notifications/
  ├── GetNotificationsUseCase.ts
  ├── MarkAsReadUseCase.ts
  ├── schemas.ts
  └── index.ts
```

---

## 🐳 Docker

### Build Image

```bash
docker build -t aki-bff:latest .
```

### Run Container

```bash
docker run -d \
  -p 4000:4000 \
  --env-file .env \
  --name aki-bff \
  aki-bff:latest
```

### Docker Compose (Example)

```yaml
version: '3.8'
services:
  bff:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - PERSONAS_BASE_URL=http://personas:3002
      - CORE_BASE_URL=http://core:3001
    depends_on:
      - personas
      - core
```

---

## 🧪 Testing

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prof@example.com","password":"pass123"}'
```

**Create Event:**
```bash
curl -X POST http://localhost:4000/v1/professor/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "class_id": 1,
    "teacher_id": 1,
    "start_time": "2025-10-26T14:00:00Z",
    "end_time": "2025-10-26T16:00:00Z",
    "location": {"latitude": -23.55, "longitude": -46.63}
  }'
```

**Scan QR:**
```bash
curl -X POST http://localhost:4000/v1/student/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qr_token": "YOUR_QR_TOKEN",
    "device_id": "device-123",
    "student_cpf": "12345678901",
    "location": {"latitude": -23.55, "longitude": -46.63}
  }'
```

---

## 📊 Error Handling

All errors follow a standardized format:

```json
{
  "code": "error_code",
  "message": "Human-readable error message",
  "details": ["Additional context"],
  "trace_id": "correlation-id-123",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `not_found` | 404 | Resource not found |
| `bad_request` | 400 | Invalid request data |
| `unauthorized` | 401 | Authentication required |
| `forbidden` | 403 | Insufficient permissions |
| `conflict` | 409 | Resource conflict |
| `qr_invalid` | 400 | QR code invalid/expired |
| `device_unbound` | 400 | Device not registered |
| `internal_error` | 500 | Server error |
| `service_unavailable` | 503 | Upstream service down |

---

## 🔐 Security Considerations

### Current State (MVP)

- ✅ JWT-based authentication
- ✅ Mock mode for development
- ✅ CORS protection
- ✅ Helmet.js security headers
- ⚠️ **Password hashing not implemented** (storing plain text)
- ⚠️ **No rate limiting**

### Production Recommendations

1. **Implement bcrypt** for password hashing
2. **Add rate limiting** (express-rate-limit)
3. **Enable HTTPS only**
4. **Implement OAuth2/SSO** for real authentication
5. **Add input sanitization**
6. **Implement RBAC** (Role-Based Access Control)

---

## 📝 Logging

Logs are written to:
- **Console**: JSON format (production) or pretty format (development)
- **Files**: `logs/combined.log` and `logs/error.log`

Each log entry includes:
- Timestamp
- Log level (info, warn, error)
- Message
- Correlation ID (for request tracking)
- Additional metadata

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**AKI! Development Team**
- Camila Delarosa
- Dimitri Delinski
- Guilherme Belo
- Yasmin Carmona

---

## 📞 Support

For issues or questions:
- **Email**: infra@aki.example
- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues

---

## 🗺️ Roadmap

- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance optimization
- [ ] Caching layer (Redis)
- [ ] WebSocket support for real-time updates
- [ ] GraphQL endpoint (optional)
- [ ] Metrics and monitoring (Prometheus)

---

**Built with ❤️ by the AKI! Team**
