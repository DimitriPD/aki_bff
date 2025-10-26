# Development Guide - AKI! BFF

Complete guide for developers working on the BFF project.

---

## 🚀 Getting Started

### Initial Setup

1. **Install Node.js 20+**
   ```bash
   node --version  # Should be >= 20.0.0
   ```

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd aki_bff
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Start dev server with hot reload
npm run dev

# In another terminal, watch for errors
npm run lint

# Format code before committing
npm run format
```

### Available Scripts

```bash
npm run dev         # Start development server with hot reload
npm run build       # Compile TypeScript to JavaScript
npm start           # Run production build
npm run lint        # Check code quality
npm run format      # Format code with Prettier
```

---

## 📝 Adding New Features

### Creating a New Vertical Slice

Follow this step-by-step process:

#### 1. Create Use Case

**Location**: `src/application/use-cases/<feature>/`

**Example**: Adding a "GetAttendanceList" feature

```typescript
// src/application/use-cases/attendance/GetAttendanceListUseCase.ts
import { CoreClient, PersonasClient } from '../../../infrastructure/http/clients';
import logger from '../../../shared/logger';

export class GetAttendanceListUseCase {
  private coreClient: CoreClient;
  private personasClient: PersonasClient;

  constructor() {
    this.coreClient = new CoreClient();
    this.personasClient = new PersonasClient();
  }

  async execute(eventId: string, correlationId: string) {
    logger.info('Fetching attendance list', { eventId, correlationId });

    // 1. Get attendances from Core
    const attendances = await this.coreClient.getAttendances({ event_id: eventId });

    // 2. Enrich with student names from Personas
    const enriched = await Promise.all(
      attendances.items.map(async (attendance) => {
        const student = await this.personasClient.getStudent(attendance.student_id);
        return {
          ...attendance,
          student_name: student.full_name,
        };
      }),
    );

    logger.info('Attendance list fetched', { count: enriched.length, correlationId });

    return {
      items: enriched,
      meta: attendances.meta,
    };
  }
}
```

#### 2. Create Validation Schema

**Location**: Same folder as use-case

```typescript
// src/application/use-cases/attendance/schemas.ts
import { z } from 'zod';

export const getAttendanceListSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
});
```

#### 3. Export from Index

```typescript
// src/application/use-cases/attendance/index.ts
export * from './GetAttendanceListUseCase';
export * from './schemas';
```

#### 4. Create Controller

**Location**: `src/interface/controllers/`

```typescript
// src/interface/controllers/AttendanceController.ts
import { Request, Response, NextFunction } from 'express';
import { GetAttendanceListUseCase } from '../../application/use-cases/attendance';
import { ApiResponse } from '../../domain/dto';

export class AttendanceController {
  private getAttendanceListUseCase: GetAttendanceListUseCase;

  constructor() {
    this.getAttendanceListUseCase = new GetAttendanceListUseCase();
  }

  async getAttendanceList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const correlationId = req.headers['x-correlation-id'] as string;
      const { eventId } = req.params;
      
      const result = await this.getAttendanceListUseCase.execute(eventId, correlationId);

      const response: ApiResponse<typeof result> = {
        data: result,
        message: 'Attendance list retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
```

#### 5. Create Routes

**Location**: `src/interface/routes/`

```typescript
// src/interface/routes/attendance.routes.ts
import { Router } from 'express';
import { AttendanceController } from '../controllers/AttendanceController';
import { authMiddleware, validate } from '../middlewares';
import { getAttendanceListSchema } from '../../application/use-cases/attendance';

const router = Router();
const attendanceController = new AttendanceController();

// Require authentication
router.use(authMiddleware);

/**
 * @route GET /attendance/event/:eventId
 * @desc Get attendance list for an event
 * @access Private
 */
router.get(
  '/event/:eventId',
  validate(getAttendanceListSchema),
  attendanceController.getAttendanceList.bind(attendanceController),
);

export default router;
```

#### 6. Register Routes in Main App

**Location**: `src/index.ts`

```typescript
// Add import
import attendanceRoutes from './interface/routes/attendance.routes';

// Register route
apiV1.use('/attendance', attendanceRoutes);
```

---

## 🧪 Testing Your Changes

### Manual Testing with cURL

```bash
# Test the new endpoint
curl -X GET http://localhost:4000/v1/attendance/event/67123abc456def789 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Logs

Logs are written to:
- Console (formatted)
- `logs/combined.log`
- `logs/error.log`

Tail logs in real-time:
```bash
tail -f logs/combined.log
```

---

## 🔍 Debugging

### Enable Debug Logs

In `.env`:
```env
LOG_LEVEL=debug
```

### Debug TypeScript in VS Code

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug BFF",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Common Debug Points

1. **Request not reaching controller?**
   - Check middleware order in `src/index.ts`
   - Verify route path matches
   - Check authentication middleware

2. **Validation failing?**
   - Review Zod schema
   - Check request payload format
   - Enable debug logs

3. **HTTP client errors?**
   - Check service URLs in `.env`
   - Verify service is running
   - Check logs for correlation ID

---

## 🎨 Code Style Guide

### Naming Conventions

```typescript
// Classes: PascalCase
class StudentController { }

// Functions/Methods: camelCase
async function getStudent() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Interfaces: PascalCase with 'I' prefix
interface IPersonasClient { }

// Types: PascalCase
type EventStatus = 'active' | 'closed';

// Files: Match class name
// StudentController.ts, not student-controller.ts
```

### Import Order

```typescript
// 1. External libraries
import express from 'express';
import { z } from 'zod';

// 2. Infrastructure/config
import { config } from '../infrastructure/config';

// 3. Domain/entities
import { Student, Event } from '../domain/entities';

// 4. Application/use-cases
import { LoginUseCase } from '../application/use-cases/auth';

// 5. Shared/utilities
import logger from '../shared/logger';
import { BadRequestError } from '../shared/errors';
```

### Error Handling Pattern

```typescript
// Always use try-catch in controllers
async function myController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Business logic
    const result = await myUseCase.execute(data);
    res.json({ data: result });
  } catch (error) {
    next(error); // Pass to error middleware
  }
}

// Throw specific errors in use-cases
if (!student) {
  throw new NotFoundError('Student not found', undefined, correlationId);
}
```

### Logging Pattern

```typescript
// At start of use-case
logger.info('Use case started', { input: data, correlationId });

// For important operations
logger.debug('Calling external service', { service: 'Personas', correlationId });

// On error
logger.error('Operation failed', { error: error.message, correlationId });

// On success
logger.info('Use case completed', { result: summary, correlationId });
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 4000 already in use"

**Solution**: 
```bash
# Change port in .env
PORT=4001

# Or kill existing process
lsof -ti:4000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :4000   # Windows
```

### Issue: TypeScript errors after adding new code

**Solution**:
```bash
# Clean and rebuild
npm run build
```

### Issue: CORS errors in browser

**Solution**: Check `.env`:
```env
CORS_ORIGIN=http://localhost:3000  # Your frontend URL
```

### Issue: Authentication fails

**Solution**: 
1. Check `MOCK_AUTH_ENABLED=true` in `.env`
2. Verify JWT_SECRET is set
3. Check token expiration

---

## 📦 Adding New Dependencies

### Installing a Package

```bash
# Production dependency
npm install <package-name>

# Development dependency
npm install --save-dev <package-name>

# With specific version
npm install <package-name>@1.2.3
```

### Common Packages You Might Add

```bash
# Database clients
npm install mongodb mongoose
npm install pg pg-hstore  # PostgreSQL

# Caching
npm install redis ioredis

# Testing
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev supertest @types/supertest

# Validation
npm install joi  # Alternative to Zod

# Utilities
npm install lodash date-fns
```

---

## 🔐 Environment Variables Guide

### Development (.env)

```env
# Server
PORT=4000
NODE_ENV=development

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty

# Mock mode (easier for development)
MOCK_AUTH_ENABLED=true
MOCK_TEACHER_ID=1

# Services (use production or local)
PERSONAS_BASE_URL=http://localhost:3002
CORE_BASE_URL=http://localhost:3001
```

### Production (.env.production)

```env
# Server
PORT=4000
NODE_ENV=production

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Real authentication
MOCK_AUTH_ENABLED=false
JWT_SECRET=<strong-secret-here>

# Production services
PERSONAS_BASE_URL=https://...
CORE_BASE_URL=https://...
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Docker Deployment

```bash
# Build image
docker build -t aki-bff:1.0.0 .

# Run container
docker run -d \
  -p 4000:4000 \
  --env-file .env.production \
  --name aki-bff \
  aki-bff:1.0.0
```

### Environment Variables in Production

Never commit `.env` files! Use:
- Azure App Service: Application Settings
- AWS: Parameter Store or Secrets Manager
- Kubernetes: ConfigMaps and Secrets
- Docker: `--env-file` or `-e` flags

---

## 📚 Additional Resources

- **TypeScript**: https://www.typescriptlang.org/docs/
- **Express**: https://expressjs.com/
- **Clean Architecture**: See STRUCTURE.md
- **Zod Validation**: https://zod.dev/
- **Winston Logging**: https://github.com/winstonjs/winston

---

## 💡 Best Practices

1. **Always use correlation IDs** for request tracking
2. **Log important operations** with context
3. **Handle errors gracefully** with specific error types
4. **Validate input** with Zod schemas
5. **Keep use-cases focused** (Single Responsibility)
6. **Write self-documenting code** with clear names
7. **Don't repeat yourself** (DRY principle)
8. **Test manually** before committing
9. **Format code** with Prettier before commit
10. **Review your own changes** before PR

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Format code: `npm run format`
4. Lint code: `npm run lint`
5. Test manually
6. Commit: `git commit -m "feat: add my feature"`
7. Push: `git push origin feature/my-feature`
8. Open Pull Request

---

**Happy Coding! 🚀**

For questions, see [README.md](README.md) or contact the team.
