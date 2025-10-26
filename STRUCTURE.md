# AKI! BFF - Project Structure

This document provides an overview of the BFF codebase organization.

## 📁 Directory Structure

```
aki_bff/
├── src/                          # Source code
│   ├── application/              # Application/Business Logic Layer
│   │   └── use-cases/           # Use cases (business logic)
│   │       ├── auth/            # Authentication flows
│   │       │   ├── LoginUseCase.ts
│   │       │   ├── ForgotPasswordUseCase.ts
│   │       │   ├── ResetPasswordUseCase.ts
│   │       │   ├── schemas.ts   # Zod validation schemas
│   │       │   └── index.ts
│   │       ├── student/         # Student operations
│   │       │   ├── BindDeviceUseCase.ts
│   │       │   ├── ScanQRUseCase.ts
│   │       │   ├── schemas.ts
│   │       │   └── index.ts
│   │       └── professor/       # Professor operations
│   │           ├── CreateEventUseCase.ts
│   │           ├── GetEventUseCase.ts
│   │           ├── GetDashboardUseCase.ts
│   │           ├── schemas.ts
│   │           └── index.ts
│   │
│   ├── domain/                   # Domain Layer (Core Business)
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   └── index.ts         # All DTOs (request/response)
│   │   ├── entities/            # Domain entities
│   │   │   └── index.ts         # Student, Teacher, Event, etc.
│   │   └── interfaces/          # Contracts/Interfaces
│   │       └── index.ts         # Service interfaces
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── config/              # Configuration management
│   │   │   └── index.ts         # Environment config
│   │   └── http/                # HTTP communication
│   │       ├── HttpClient.ts    # Base HTTP client with retry logic
│   │       └── clients/         # Service-specific clients
│   │           ├── PersonasClient.ts
│   │           ├── CoreClient.ts
│   │           ├── FunctionPasswordClient.ts
│   │           ├── FunctionNotificationClient.ts
│   │           └── index.ts
│   │
│   ├── interface/                # Interface/Presentation Layer
│   │   ├── controllers/         # HTTP request handlers
│   │   │   ├── AuthController.ts
│   │   │   ├── StudentController.ts
│   │   │   └── ProfessorController.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── correlationId.middleware.ts
│   │   │   ├── requestLogger.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── index.ts
│   │   └── routes/              # Route definitions
│   │       ├── auth.routes.ts
│   │       ├── student.routes.ts
│   │       └── professor.routes.ts
│   │
│   ├── shared/                   # Shared utilities
│   │   ├── errors/              # Error handling
│   │   │   ├── AppError.ts      # Custom error classes
│   │   │   ├── errorHandler.ts  # Express error handler
│   │   │   └── index.ts
│   │   ├── logger/              # Logging utilities
│   │   │   └── index.ts         # Winston logger config
│   │   └── utils/               # Helper functions
│   │       ├── helpers.ts       # Utility functions
│   │       └── index.ts
│   │
│   └── index.ts                  # Application entry point
│
├── docs/                         # Documentation
│   ├── AKI! - BFF (Backend For Frontend) - Swagger.yaml
│   ├── AKI! - Microservice A (Personas) - Swagger.yaml
│   ├── AKI! - Microservice B (Core) - Swagger.yaml
│   ├── Especificações MVP.md
│   └── README.md
│
├── logs/                         # Application logs (generated)
│   ├── combined.log
│   └── error.log
│
├── dist/                         # Compiled TypeScript (generated)
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── .eslintrc.json               # ESLint configuration
├── .prettierrc.json             # Prettier configuration
├── .dockerignore                # Docker ignore rules
├── Dockerfile                    # Docker image definition
├── docker-compose.yml           # Docker Compose configuration
├── package.json                  # NPM dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                     # Main documentation
```

## 🏗️ Architecture Layers

### 1. **Domain Layer** (`src/domain/`)
- **Pure business logic** with no external dependencies
- Defines entities, DTOs, and interfaces
- Independent of frameworks and external services

### 2. **Application Layer** (`src/application/`)
- **Use cases** implementing business workflows
- Orchestrates domain objects and infrastructure services
- Contains validation schemas (Zod)

### 3. **Infrastructure Layer** (`src/infrastructure/`)
- **External service integrations** (HTTP clients)
- Configuration management
- Database adapters (if needed)

### 4. **Interface Layer** (`src/interface/`)
- **HTTP/API layer** (Express controllers, routes)
- Middleware (auth, validation, logging)
- Request/response handling

### 5. **Shared Layer** (`src/shared/`)
- **Cross-cutting concerns** (logging, errors, utilities)
- Reusable across all layers

## 🔄 Request Flow

```
1. HTTP Request
   ↓
2. Middleware (Correlation ID, Logger)
   ↓
3. Middleware (Authentication)
   ↓
4. Middleware (Validation - Zod)
   ↓
5. Route Handler → Controller
   ↓
6. Use Case (Business Logic)
   ↓
7. Infrastructure (HTTP Clients)
   ↓
8. External Services (Personas, Core, Functions)
   ↓
9. Response Formatting
   ↓
10. HTTP Response (JSON)
```

## 📦 Module Organization

Each feature follows **Vertical Slice Architecture**:

```
feature/
├── <Feature>UseCase.ts     # Business logic
├── schemas.ts              # Validation schemas
└── index.ts                # Exports
```

Example for "Student Scan QR":
```
student/
├── ScanQRUseCase.ts        # Orchestrates device resolution & attendance
├── BindDeviceUseCase.ts    # Handles device binding
├── schemas.ts              # Zod schemas for validation
└── index.ts                # Export all
```

## 🔌 HTTP Client Architecture

All HTTP clients extend the base `HttpClient` class which provides:
- Automatic retry on failures
- Request/response logging
- Correlation ID propagation
- Timeout management
- Error transformation

## 🛡️ Error Handling Strategy

1. **Custom Error Classes** in `src/shared/errors/AppError.ts`
2. **Centralized Error Handler** in `src/shared/errors/errorHandler.ts`
3. **Standardized Error Response Format**:
   ```json
   {
     "code": "error_code",
     "message": "Human-readable message",
     "details": [],
     "trace_id": "correlation-id",
     "timestamp": "ISO-8601"
   }
   ```

## 🧪 Adding a New Feature

To add a new vertical slice:

1. **Create use-case** in `src/application/use-cases/<feature>/`
2. **Add validation schema** in the same folder
3. **Create controller** in `src/interface/controllers/`
4. **Define routes** in `src/interface/routes/`
5. **Register route** in `src/index.ts`

## 📝 Naming Conventions

- **Files**: PascalCase for classes (`AuthController.ts`), camelCase for utilities (`helpers.ts`)
- **Classes**: PascalCase (`LoginUseCase`)
- **Functions**: camelCase (`getStudent()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase with `I` prefix (`IPersonasClient`)

## 🔍 Key Design Patterns

- **Dependency Injection**: Services injected via constructors
- **Repository Pattern**: HTTP clients abstract external services
- **Factory Pattern**: Use-case instantiation in controllers
- **Strategy Pattern**: Different authentication strategies (mock vs real)
- **Middleware Pattern**: Express middleware chain

---

**For detailed API documentation, see [README.md](../README.md)**
