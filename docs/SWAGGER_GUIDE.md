# 📚 Swagger Documentation Guide

## Accessing the API Documentation

The AKI! BFF provides interactive API documentation using **Swagger UI** at:

```
http://localhost:4000/docs
```

## Features

### 🔍 Interactive API Explorer
- **Browse all endpoints**: View complete API specification
- **Try it out**: Execute requests directly from the browser
- **See responses**: View real-time responses with status codes
- **Authentication**: Test protected endpoints with JWT tokens

### 📖 Complete Specification
- Request/response schemas
- Data models and DTOs
- Error codes and messages
- Authentication requirements
- Query parameters and path variables

---

## How to Use Swagger UI

### 1. Open the Documentation
Start the BFF server and navigate to:
```
http://localhost:4000/docs
```

### 2. Browse Endpoints
The documentation is organized by tags:
- **Auth**: Authentication and password recovery
- **Teachers**: Teacher profile and class management
- **Students**: Student QR scanning
- **Events**: Event lifecycle management
- **Attendances**: Attendance records
- **Classes**: Class operations
- **Occurrences**: Occurrence tracking

### 3. Test an Endpoint

#### For Public Endpoints (no auth required):
1. Click on an endpoint (e.g., `POST /auth/login`)
2. Click **"Try it out"**
3. Fill in the request body with test data
4. Click **"Execute"**
5. View the response below

**Example: Login**
```json
{
  "email": "professor@example.com",
  "password": "password123"
}
```

#### For Protected Endpoints (requires authentication):
1. First, login using `POST /auth/login`
2. Copy the JWT token from the response
3. Click the **"Authorize"** button at the top
4. Enter: `Bearer <your-token>` (replace `<your-token>` with actual token)
5. Click **"Authorize"** and **"Close"**
6. Now you can test protected endpoints

**Example Authorization:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. View Response
After execution, you'll see:
- **Response code**: 200, 201, 400, 401, 404, etc.
- **Response body**: JSON data returned by the API
- **Response headers**: Including correlation ID for tracking
- **Curl command**: Pre-generated command for terminal use

---

## Example Workflow

### Scenario: Professor creates an event and views it

**Step 1: Login**
```
POST /v1/auth/login
```
Request:
```json
{
  "email": "professor@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "teacher": {
      "id": 1,
      "full_name": "Mock Teacher"
    }
  }
}
```

**Step 2: Authorize**
- Click **"Authorize"** button
- Enter: `Bearer eyJhbGciOiJIUzI1NiIs...`
- Click **"Authorize"**

**Step 3: Create Event**
```
POST /v1/professor/events
```
Request:
```json
{
  "class_id": 1,
  "teacher_id": 1,
  "start_time": "2025-10-27T10:00:00Z",
  "end_time": "2025-10-27T12:00:00Z",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  }
}
```

**Step 4: View Event**
```
GET /v1/professor/events/{eventId}
```
(Use the `id` from the creation response)

---

## Testing with Mock Authentication

The BFF supports **mock authentication** in development mode. When `MOCK_AUTH_ENABLED=true`:

1. Any login attempt succeeds
2. Returns a valid JWT token
3. Protected endpoints work with the mock token
4. No actual password validation

This is useful for:
- Frontend development without backend dependencies
- Testing API flows
- Demo presentations

---

## Tips and Best Practices

### 🎯 Using Correlation IDs
Every request gets a `x-correlation-id` header for tracking:
```
x-correlation-id: 550e8400-e29b-41d4-a716-446655440000
```

Use this ID when:
- Debugging issues
- Reporting errors
- Tracing request flow across services

### 🔄 Retesting Requests
Swagger UI remembers your last inputs:
- Modify values and re-execute
- Test edge cases quickly
- Compare different responses

### 📋 Copying Curl Commands
Click **"Copy curl"** to get terminal-ready commands:
```bash
curl -X 'POST' \
  'http://localhost:4000/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"professor@example.com","password":"password123"}'
```

### 🛠️ Schema Validation
Swagger validates your input before sending:
- Required fields are marked with `*`
- Data types are enforced
- Invalid JSON is caught before execution

### 📊 Response Codes
Common status codes:
- **200 OK**: Successful GET/PUT
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing or invalid token
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Business rule violation
- **500 Internal Server Error**: Server error

---

## Troubleshooting

### Cannot access /docs
**Issue**: 404 error on `/docs`
**Solution**:
1. Ensure server is running: `npm run dev`
2. Check server logs for Swagger initialization
3. Verify YAML file exists: `docs/AKI! - BFF (Backend For Frontend) - Swagger.yaml`

### Authorization not working
**Issue**: Protected endpoints return 401
**Solution**:
1. Login first to get a valid token
2. Click **"Authorize"** button (top right)
3. Enter: `Bearer <token>` (don't forget "Bearer " prefix)
4. Make sure token hasn't expired (default: 24h)

### Swagger UI styles broken
**Issue**: UI looks unstyled
**Solution**:
1. Check `helmet` configuration in `src/index.ts`
2. Ensure `contentSecurityPolicy: false` is set
3. Clear browser cache

### Request timeout
**Issue**: Requests take too long
**Solution**:
1. Check microservice availability
2. Verify URLs in `.env`
3. Increase `REQUEST_TIMEOUT_MS` if needed

---

## Development vs Production

### Development Mode
- Mock authentication enabled
- Swagger UI accessible at `/docs`
- Detailed error messages
- CORS allows all origins

### Production Mode
- Real authentication required
- Consider disabling Swagger UI (security)
- Generic error messages
- CORS restricted to specific domains

### Disabling Swagger in Production
To disable Swagger UI in production, wrap the route:

```typescript
if (process.env.NODE_ENV !== 'production') {
  this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
```

---

## Additional Resources

- **OpenAPI Specification**: https://swagger.io/specification/
- **Swagger UI Documentation**: https://swagger.io/tools/swagger-ui/
- **API Examples**: See `docs/API_EXAMPLES.md`
- **Architecture Guide**: See `docs/STRUCTURE.md`

---

## Support

For issues or questions:
1. Check server logs for error details
2. Use correlation IDs for debugging
3. Refer to `docs/API_EXAMPLES.md` for working examples
4. Contact the AKI! infrastructure team

---

**Happy Testing! 🚀**
