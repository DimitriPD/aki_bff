# API Examples - AKI! BFF

Complete collection of API request/response examples for testing and integration.

---

## 🔐 Authentication Endpoints

### 1. Mock Login

**Request:**
```http
POST http://localhost:4000/v1/auth/login
Content-Type: application/json

{
  "email": "professor@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFjaGVySWQiOjEsImVtYWlsIjoicHJvZmVzc29yQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk4MzQ1NjAwLCJleHAiOjE2OTg0MzIwMDB9.signature",
    "teacher": {
      "id": 1,
      "full_name": "Mock Teacher",
      "email": "professor@example.com"
    }
  },
  "message": "Login successful"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"professor@example.com","password":"password123"}'
```

---

### 2. Forgot Password

**Request:**
```http
POST http://localhost:4000/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "professor@example.com"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "status": "success",
    "message": "If your email is registered, you will receive password recovery instructions."
  },
  "message": "Password recovery email sent"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"professor@example.com"}'
```

---

### 3. Reset Password

**Request:**
```http
POST http://localhost:4000/v1/auth/reset-password
Content-Type: application/json

{
  "token": "recovery-token-from-email",
  "new_password": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "status": "success",
    "message": "Password has been reset successfully. You can now login with your new password."
  },
  "message": "Password reset successful"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"recovery-token-from-email","new_password":"NewSecurePassword123!"}'
```

---

## 👨‍🎓 Student Endpoints

### 4. Bind Device (First Time Setup)

**Request:**
```http
POST http://localhost:4000/v1/student/device
Content-Type: application/json

{
  "cpf": "12345678901",
  "device_id": "device-uuid-abc123"
}
```

**Response (200 OK):**
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

**Error Response (409 Conflict - Device already bound):**
```json
{
  "code": "conflict",
  "message": "Device is already bound to another student",
  "details": [
    {
      "device_id": "device-uuid-abc123"
    }
  ],
  "trace_id": "req-123-456",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/v1/student/device \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901","device_id":"device-uuid-abc123"}'
```

---

### 5. Scan QR Code (Register Attendance)

**Request (with location):**
```http
POST http://localhost:4000/v1/student/scan
Content-Type: application/json

{
  "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoiNjcxMjNhYmM0NTZkZWY3ODkiLCJpYXQiOjE2OTgzNDU2MDAsImV4cCI6MTY5ODM0OTIwMH0.signature",
  "device_id": "device-uuid-abc123",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633308
  }
}
```

**Response (201 Created - Success):**
```json
{
  "data": {
    "status": "success",
    "message": "Attendance registered successfully!",
    "attendance": {
      "id": "att-xyz789",
      "event_id": "67123abc456def789",
      "student_name": "João Silva",
      "timestamp": "2025-10-26T14:30:00.000Z",
      "within_radius": true
    }
  },
  "message": "Attendance registered successfully!"
}
```

**Response (201 Created - Outside radius):**
```json
{
  "data": {
    "status": "success",
    "message": "Attendance registered, but you are outside the expected location radius.",
    "attendance": {
      "id": "att-xyz790",
      "event_id": "67123abc456def789",
      "student_name": "João Silva",
      "timestamp": "2025-10-26T14:30:00.000Z",
      "within_radius": false
    }
  },
  "message": "Attendance registered, but you are outside the expected location radius."
}
```

**Error Response (400 Bad Request - QR expired):**
```json
{
  "code": "qr_invalid",
  "message": "QR code is invalid or expired",
  "trace_id": "req-789-012",
  "timestamp": "2025-10-26T14:30:00.000Z"
}
```

**cURL:**
```bash
curl -X POST http://localhost:4000/v1/student/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qr_token": "eyJhbGciOiJIUzI1NiIs...",
    "device_id": "device-uuid-abc123",
    "location": {"latitude": -23.550520, "longitude": -46.633308}
  }'
```

---

## 👨‍🏫 Professor Endpoints

**Note**: All professor endpoints require JWT authentication.

### 6. Get Dashboard

**Request:**
```http
GET http://localhost:4000/v1/professor/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
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
      },
      {
        "id": 102,
        "name": "Turma B - Física",
        "student_count": 25
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

**cURL:**
```bash
TOKEN="your-jwt-token-here"
curl -X GET http://localhost:4000/v1/professor/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

### 7. Create Event

**Request:**
```http
POST http://localhost:4000/v1/professor/events
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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

**Response (201 Created):**
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
    "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "status": "active",
    "created_at": "2025-10-26T12:00:00Z",
    "updated_at": "2025-10-26T12:00:00Z"
  },
  "message": "Event created successfully"
}
```

**Error Response (409 Conflict - Overlapping event):**
```json
{
  "code": "conflict",
  "message": "Event overlaps with existing event for this class",
  "details": [
    {
      "existing_event_id": "67123abc456def788"
    }
  ],
  "trace_id": "req-345-678",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

**cURL:**
```bash
TOKEN="your-jwt-token-here"
curl -X POST http://localhost:4000/v1/professor/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 101,
    "teacher_id": 1,
    "start_time": "2025-10-26T14:00:00Z",
    "end_time": "2025-10-26T16:00:00Z",
    "location": {"latitude": -23.550520, "longitude": -46.633308}
  }'
```

---

### 8. Get Event Details

**Request:**
```http
GET http://localhost:4000/v1/professor/events/67123abc456def789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
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
    "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "status": "active",
    "created_at": "2025-10-26T12:00:00Z",
    "updated_at": "2025-10-26T12:00:00Z"
  },
  "message": "Event retrieved successfully"
}
```

**cURL:**
```bash
TOKEN="your-jwt-token-here"
EVENT_ID="67123abc456def789"
curl -X GET http://localhost:4000/v1/professor/events/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 9. Update Event

**Request:**
```http
PUT http://localhost:4000/v1/professor/events/67123abc456def789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "closed"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "67123abc456def789",
    "class_id": 101,
    "teacher_id": 1,
    "start_time": "2025-10-26T14:00:00Z",
    "end_time": "2025-10-26T16:00:00Z",
    "location": {
      "latitude": -23.550520,
      "longitude": -46.633308
    },
    "status": "closed",
    "created_at": "2025-10-26T12:00:00Z",
    "updated_at": "2025-10-26T16:05:00Z"
  },
  "message": "Event updated successfully"
}
```

**cURL:**
```bash
TOKEN="your-jwt-token-here"
EVENT_ID="67123abc456def789"
curl -X PUT http://localhost:4000/v1/professor/events/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}'
```

---

### 10. Delete Event

**Request:**
```http
DELETE http://localhost:4000/v1/professor/events/67123abc456def789
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content):**
```
(No body)
```

**Error Response (409 Conflict - Cannot delete closed event):**
```json
{
  "code": "conflict",
  "message": "Cannot delete closed event",
  "trace_id": "req-901-234",
  "timestamp": "2025-10-26T16:00:00.000Z"
}
```

**cURL:**
```bash
TOKEN="your-jwt-token-here"
EVENT_ID="67123abc456def789"
curl -X DELETE http://localhost:4000/v1/professor/events/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

### 11. Get Event QR Code

**Request:**
```http
GET http://localhost:4000/v1/professor/events/67123abc456def789/qr
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "data": {
    "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoiNjcxMjNhYmM0NTZkZWY3ODkiLCJpYXQiOjE2OTgzNDU2MDAsImV4cCI6MTY5ODM0OTIwMH0.signature",
    "event_id": "67123abc456def789",
    "expires_at": "2025-10-26T16:00:00Z",
    "svg": "<svg>...</svg>"
  },
  "message": "QR code retrieved successfully"
}
```

**cURL:**
```bash
TOKEN="your-jwt-token-here"
EVENT_ID="67123abc456def789"
curl -X GET http://localhost:4000/v1/professor/events/$EVENT_ID/qr \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Health Check

**Request:**
```http
GET http://localhost:4000/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-26T12:00:00.000Z",
  "service": "aki-bff",
  "version": "1.0.0"
}
```

**cURL:**
```bash
curl http://localhost:4000/health
```

---

## ⚠️ Common Error Responses

### 400 Bad Request (Validation Error)

```json
{
  "code": "bad_request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ],
  "trace_id": "req-123-456",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

### 401 Unauthorized

```json
{
  "code": "unauthorized",
  "message": "No token provided",
  "trace_id": "req-234-567",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

### 404 Not Found

```json
{
  "code": "not_found",
  "message": "Resource not found",
  "trace_id": "req-345-678",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

### 500 Internal Server Error

```json
{
  "code": "internal_error",
  "message": "An unexpected error occurred",
  "trace_id": "req-456-789",
  "timestamp": "2025-10-26T12:00:00.000Z"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- JWT tokens expire after 24 hours by default
- QR tokens expire when the event ends
- Correlation IDs (trace_id) are generated for each request
- All responses include a `message` field for user-facing text

---

**For more details, see [README.md](README.md)**
