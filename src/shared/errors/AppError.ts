export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown[],
    public readonly traceId?: string,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: unknown[], traceId?: string) {
    super(404, 'not_found', message, details, traceId);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request', details?: unknown[], traceId?: string) {
    super(400, 'bad_request', message, details, traceId);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown[], traceId?: string) {
    super(401, 'unauthorized', message, details, traceId);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: unknown[], traceId?: string) {
    super(403, 'forbidden', message, details, traceId);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown[], traceId?: string) {
    super(409, 'conflict', message, details, traceId);
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details?: unknown[], traceId?: string) {
    super(500, 'internal_error', message, details, traceId);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable', details?: unknown[], traceId?: string) {
    super(503, 'service_unavailable', message, details, traceId);
    this.name = 'ServiceUnavailableError';
  }
}

export class QRInvalidError extends AppError {
  constructor(message = 'QR code is invalid or expired', details?: unknown[], traceId?: string) {
    super(400, 'qr_invalid', message, details, traceId);
    this.name = 'QRInvalidError';
  }
}

export class AttendanceConflictError extends AppError {
  constructor(message = 'Attendance already registered', details?: unknown[], traceId?: string) {
    super(409, 'attendance_conflict', message, details, traceId);
    this.name = 'AttendanceConflictError';
  }
}

export class DeviceUnboundError extends AppError {
  constructor(message = 'Device not bound to any student', details?: unknown[], traceId?: string) {
    super(400, 'device_unbound', message, details, traceId);
    this.name = 'DeviceUnboundError';
  }
}

export class TokenInvalidError extends AppError {
  constructor(message = 'Token is invalid or expired', details?: unknown[], traceId?: string) {
    super(400, 'token_invalid', message, details, traceId);
    this.name = 'TokenInvalidError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials', details?: unknown[], traceId?: string) {
    super(401, 'invalid_credentials', message, details, traceId);
    this.name = 'InvalidCredentialsError';
  }
}
