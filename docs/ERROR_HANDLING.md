# Error Handling no BFF

## Visão Geral

O BFF implementa um sistema robusto de tratamento de erros que propaga corretamente os erros das APIs externas (Personas, Core, Azure Functions) para o cliente, mantendo consistência e rastreabilidade.

## Estrutura de Erros

### Formato Padrão de Resposta de Erro

Todos os erros retornados pelo BFF seguem este formato:

```json
{
  "code": "error_code",
  "message": "Human-readable error message",
  "details": ["Optional array of additional details"],
  "trace_id": "correlation-id-for-tracing",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

### Códigos de Status HTTP

- **400 Bad Request**: Dados inválidos enviados pelo cliente
- **401 Unauthorized**: Autenticação falhou ou token inválido
- **403 Forbidden**: Usuário autenticado mas sem permissão
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito de dados (ex: evento sobreposto, presença duplicada)
- **500 Internal Server Error**: Erro interno do servidor
- **503 Service Unavailable**: Serviço externo indisponível

## Tipos de Erros

### 1. Erros de Cliente (4xx)

Estes erros **não são retentados automaticamente** pois indicam problema nos dados enviados:

#### Bad Request (400)
```typescript
{
  "code": "bad_request",
  "message": "Invalid request data",
  "details": ["field 'email' is required"],
  "trace_id": "abc123",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

#### Not Found (404)
```typescript
{
  "code": "not_found",
  "message": "Event not found",
  "trace_id": "abc123",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

#### Conflict (409)
```typescript
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid event data",
  "details": [
    "start_time: Start time must be before end time",
    "start_time: Cannot create events in the past"
  ],
  "trace_id": "abc123",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

### 2. Erros de Servidor (5xx)

Estes erros **são retentados automaticamente** até 2 vezes:

#### Internal Server Error (500)
```typescript
{
  "code": "internal_error",
  "message": "An unexpected error occurred",
  "trace_id": "abc123",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

#### Service Unavailable (503)
```typescript
{
  "code": "service_unavailable",
  "message": "Service request timeout",
  "details": [{"service": "https://aki-microservice-core.azurewebsites.net"}],
  "trace_id": "abc123",
  "timestamp": "2025-10-26T18:00:00.000Z"
}
```

## Propagação de Erros das APIs Externas

O BFF **preserva e propaga** os erros das APIs externas, incluindo estruturas aninhadas:

### Formato de Resposta do Core

O Core microservice retorna erros em formato aninhado:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid event data",
    "details": ["start_time: Start time must be before end time"]
  }
}
```

### Extração Automática pelo BFF

O BFF **automaticamente extrai** o objeto `error` aninhado e propaga corretamente:

```typescript
// HttpClient detecta estrutura {error: {...}}
const errorData = data?.error || data;

throw new AppError(
  status,
  errorData?.code,      // ✅ "VALIDATION_ERROR" 
  errorData?.message,   // ✅ "Invalid event data"
  errorData?.details,   // ✅ ["start_time: ..."]
  correlationId,
);
```

### Exemplo: Erro do Core Microservice

**Requisição ao BFF:**
```http
POST /v1/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "class_id": 1,
  "teacher_id": 1,
  "start_time": "2025-01-01T10:00:00Z",
  "end_time": "2025-01-01T09:00:00Z",
  "location": {"latitude": -23.5, "longitude": -46.6}
}
```

**Resposta do Core (erro):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid event data",
    "details": [
      "start_time: Start time must be before end time",
      "start_time: Cannot create events in the past"
    ]
  }
}
```

**Resposta do BFF (propagada):**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": "VALIDATION_ERROR",
  "message": "Invalid event data",
  "details": [
    "start_time: Start time must be before end time",
    "start_time: Cannot create events in the past"
  ],
  "trace_id": "2ab70e83-0a2a-47c0-a763-3778bc4258d7",
  "timestamp": "2025-10-26T18:37:12.189Z"
}
```

## Retry Logic

### Quando Retry Acontece

O BFF automaticamente tenta novamente (retry) apenas em casos de:

1. **Status 5xx** (erros de servidor)
2. **Timeout** (ECONNABORTED, ETIMEDOUT)
3. **Conexão recusada** (ECONNREFUSED)

### Quando Retry NÃO Acontece

- **Status 4xx** (erros de cliente)
- Após 2 tentativas falhadas

### Configuração

```typescript
{
  maxRetries: 2,        // Máximo de tentativas
  retryDelay: 1000,     // Delay entre tentativas (1 segundo)
  timeout: 8000         // Timeout por requisição (8 segundos)
}
```

## Correlation IDs

Cada requisição recebe um **Correlation ID** único para rastreamento:

```http
GET /v1/events/123
x-correlation-id: 5358f66e-ded7-4c43-b571-b54a4ed48be2
```

Este ID é:
- Gerado automaticamente se não fornecido
- Propagado para todas as APIs downstream
- Incluído em todos os logs
- Retornado na resposta como `trace_id`

### Rastreamento End-to-End

```
Cliente → BFF → Core/Personas → Resposta
   ↓       ↓         ↓
  ID1    ID1       ID1
```

Todos os serviços logam com o mesmo Correlation ID, permitindo rastrear toda a jornada da requisição.

## Logging

Todos os erros são logados com contexto completo:

```json
{
  "level": "error",
  "message": "HTTP Response Error Request failed with status code 400",
  "service": "aki-bff",
  "status": 400,
  "url": "/events",
  "correlationId": "1761514632189-r3jknelvw",
  "responseData": {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid event data",
      "details": [
        "start_time: Start time must be before end time"
      ]
    }
  }
}
```

## Tratamento em Controllers

Os controllers não precisam tratar erros explicitamente - o middleware de erro global captura tudo:

```typescript
// ❌ Não é necessário
async getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await this.getEventUseCase.execute(eventId, correlationId);
    res.json(event);
  } catch (error) {
    next(error); // Middleware global trata
  }
}

// ✅ Pode ser simplificado
async getEvent(req: Request, res: Response, next: NextFunction) {
  const event = await this.getEventUseCase.execute(eventId, correlationId);
  res.json(event);
}
```

## Exemplos de Uso

### Tratamento no Frontend

```typescript
async function createEvent(data: EventData) {
  try {
    const response = await fetch('/v1/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-correlation-id': generateId(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Exibir detalhes específicos do erro
      if (error.code === 'VALIDATION_ERROR' && error.details) {
        error.details.forEach(detail => {
          console.error(detail); // "start_time: Start time must be before end time"
        });
      }
      
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
}
```

## Melhores Práticas

1. **Sempre incluir Correlation ID** nas requisições para rastreamento
2. **Verificar `details` array** para informações específicas de validação
3. **Não fazer retry manual** de erros 4xx
4. **Implementar timeout no cliente** para evitar espera infinita
5. **Logar trace_id** em erros no frontend para facilitar debug

## Classes de Erro Disponíveis

```typescript
import {
  AppError,              // Base class
  NotFoundError,         // 404
  BadRequestError,       // 400
  UnauthorizedError,     // 401
  ForbiddenError,        // 403
  ConflictError,         // 409
  InternalServerError,   // 500
  ServiceUnavailableError, // 503
  QRInvalidError,        // 400 + custom code
  AttendanceConflictError, // 409 + custom code
  DeviceUnboundError,    // 400 + custom code
  TokenInvalidError,     // 400 + custom code
} from '@/shared/errors';
```

## Debugging

### Ver Erros em Tempo Real

```bash
# Logs em desenvolvimento
npm run dev

# Filtrar apenas erros
npm run dev 2>&1 | grep "error"
```

### Testar Error Handling

```bash
# Teste de erro 404
curl http://localhost:4000/v1/events/invalid-id \
  -H "Authorization: Bearer fake-token"

# Teste de erro 400
curl -X POST http://localhost:4000/v1/events \
  -H "Authorization: Bearer fake-token" \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```
