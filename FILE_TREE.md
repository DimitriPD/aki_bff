# AKI! BFF - Complete File Tree

## Generated Project Structure

```
aki_bff/
│
├── 📄 Configuration Files
│   ├── package.json                    # NPM dependencies and scripts
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Git ignore patterns
│   ├── .eslintrc.json                  # ESLint configuration
│   ├── .prettierrc.json                # Prettier code formatting
│   ├── .dockerignore                   # Docker ignore patterns
│   ├── Dockerfile                      # Docker image definition
│   └── docker-compose.yml              # Docker Compose orchestration
│
├── 📚 Documentation
│   ├── README.md                       # Main project documentation
│   ├── QUICKSTART.md                   # Quick start guide
│   ├── STRUCTURE.md                    # Detailed architecture guide
│   └── docs/                           # Original specification files
│       ├── AKI! - BFF (Backend For Frontend) - Swagger.yaml
│       ├── AKI! - Microservice A (Personas) - Swagger.yaml
│       ├── AKI! - Microservice B (Core) - Swagger.yaml
│       ├── Especificações MVP.md
│       ├── microserviceA_personas.sql
│       ├── microserviceB_core_schema_mongo_db.js
│       └── README.md
│
└── 📂 src/                             # Source code directory
    │
    ├── 🧠 application/                 # Application Layer (Business Logic)
    │   └── use-cases/                  # Use case implementations
    │       ├── auth/                   # Authentication flows
    │       │   ├── LoginUseCase.ts
    │       │   ├── ForgotPasswordUseCase.ts
    │       │   ├── ResetPasswordUseCase.ts
    │       │   ├── schemas.ts
    │       │   └── index.ts
    │       ├── student/                # Student operations
    │       │   ├── BindDeviceUseCase.ts
    │       │   ├── ScanQRUseCase.ts
    │       │   ├── schemas.ts
    │       │   └── index.ts
    │       └── professor/              # Professor operations
    │           ├── CreateEventUseCase.ts
    │           ├── GetEventUseCase.ts
    │           ├── GetDashboardUseCase.ts
    │           ├── schemas.ts
    │           └── index.ts
    │
    ├── 🎯 domain/                      # Domain Layer (Core Business)
    │   ├── dto/                        # Data Transfer Objects
    │   │   └── index.ts
    │   ├── entities/                   # Domain entities
    │   │   └── index.ts
    │   └── interfaces/                 # Service contracts
    │       └── index.ts
    │
    ├── 🏗️ infrastructure/              # Infrastructure Layer
    │   ├── config/                     # Configuration management
    │   │   └── index.ts
    │   └── http/                       # HTTP clients
    │       ├── HttpClient.ts           # Base HTTP client with retry
    │       └── clients/                # Service-specific clients
    │           ├── PersonasClient.ts
    │           ├── CoreClient.ts
    │           ├── FunctionPasswordClient.ts
    │           ├── FunctionNotificationClient.ts
    │           └── index.ts
    │
    ├── 🌐 interface/                   # Interface Layer (Presentation)
    │   ├── controllers/                # HTTP request handlers
    │   │   ├── AuthController.ts
    │   │   ├── StudentController.ts
    │   │   └── ProfessorController.ts
    │   ├── middlewares/                # Express middlewares
    │   │   ├── auth.middleware.ts
    │   │   ├── correlationId.middleware.ts
    │   │   ├── requestLogger.middleware.ts
    │   │   ├── validation.middleware.ts
    │   │   └── index.ts
    │   └── routes/                     # Route definitions
    │       ├── auth.routes.ts
    │       ├── student.routes.ts
    │       └── professor.routes.ts
    │
    ├── 🔧 shared/                      # Shared utilities
    │   ├── errors/                     # Error handling
    │   │   ├── AppError.ts
    │   │   ├── errorHandler.ts
    │   │   └── index.ts
    │   ├── logger/                     # Logging
    │   │   └── index.ts
    │   └── utils/                      # Helper functions
    │       ├── helpers.ts
    │       └── index.ts
    │
    └── index.ts                        # Main application entry point
```

## 📊 File Count Summary

| Category | Count | Description |
|----------|-------|-------------|
| **Configuration** | 9 | Project setup and tooling config |
| **Documentation** | 11 | README, guides, and specs |
| **Use Cases** | 12 | Business logic implementations |
| **Domain** | 3 | Core domain definitions |
| **Infrastructure** | 6 | HTTP clients and config |
| **Interface** | 10 | Controllers, routes, middleware |
| **Shared** | 6 | Utilities, errors, logging |
| **Entry Point** | 1 | Main application file |
| **Total** | **58 files** | Complete BFF implementation |

## 🎯 Key Features Implemented

### ✅ Authentication Flow
- Mock login with JWT
- Password recovery (via Azure Function)
- Password reset

### ✅ Student Flow
- Device binding (CPF + device ID)
- QR code scanning for attendance
- Automatic device registration on first scan
- Location validation

### ✅ Professor Flow
- Dashboard with aggregated data
- Event CRUD operations
- QR code generation for events
- Class and attendance management

### ✅ Infrastructure
- HTTP clients with retry logic
- Correlation ID tracking
- Centralized error handling
- Request/response logging
- Configuration management

### ✅ Architecture
- Clean Architecture layers
- Vertical Slice organization
- SOLID principles
- TypeScript strict mode
- Dependency injection

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env`
3. **Run development server**: `npm run dev`
4. **Test health endpoint**: `curl http://localhost:4000/health`

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📦 Main Dependencies

- **express**: Web framework
- **axios**: HTTP client
- **jsonwebtoken**: JWT authentication
- **zod**: Schema validation
- **winston**: Logging
- **helmet**: Security headers
- **cors**: CORS support
- **typescript**: Type safety

## 🐳 Docker Support

Build and run with Docker:
```bash
docker build -t aki-bff:latest .
docker run -p 4000:4000 --env-file .env aki-bff:latest
```

Or use Docker Compose:
```bash
docker-compose up
```

## 📝 Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start development: `npm run dev`
4. Read the documentation: `README.md`
5. Test the API endpoints
6. Deploy to production

---

**Project successfully generated! Ready for development. 🎉**
