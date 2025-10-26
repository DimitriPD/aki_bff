# Endpoint /scan - Registro de Presença via QR Code

## Visão Geral

O endpoint `/scan` permite que estudantes registrem presença em eventos escaneando um código QR com seus dispositivos móveis. Este é um endpoint **público** (sem autenticação JWT) para permitir acesso fácil via aplicativo mobile.

## Especificação

### Request

```http
POST /v1/scan
Content-Type: application/json

{
  "qr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "device_id": "uuid-do-dispositivo",
  "student_cpf": "12345678901",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333
  }
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `qr_token` | string | ✅ Sim | Token JWT extraído do QR Code do evento |
| `device_id` | string | ✅ Sim | Identificador único do dispositivo (UUID) |
| `student_cpf` | string | ⚠️ Condicional | CPF do estudante (11 dígitos). Obrigatório na primeira vez |
| `location` | object | ❌ Não | Localização GPS do dispositivo |
| `location.latitude` | number | ❌ Não | Latitude |
| `location.longitude` | number | ❌ Não | Longitude |

### Response (Sucesso)

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "data": {
    "status": "success",
    "message": "Attendance registered successfully!",
    "attendance": {
      "id": "68fe94b9513970a99018ca8a",
      "event_id": "68fd76dc51eef927c2eefc52",
      "student_name": "João Silva",
      "timestamp": "2025-10-26T21:38:01.330Z",
      "within_radius": true
    }
  },
  "message": "Attendance recorded"
}
```

### Response (Erro)

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": "qr_invalid",
  "message": "QR code is invalid or expired",
  "details": ["Token has expired"],
  "trace_id": "correlation-id",
  "timestamp": "2025-10-26T21:38:01.330Z"
}
```

## Fluxo de Funcionamento

```
┌─────────────┐
│   Student   │
│  Scans QR   │
└──────┬──────┘
       │
       │ POST /v1/scan
       │ {qr_token, device_id, student_cpf, location}
       ▼
┌──────────────────┐
│       BFF        │
│  ScanQRUseCase   │
└────┬────────┬────┘
     │        │
     │        └─────────────────┐
     │                          │
     ▼                          ▼
┌─────────────┐         ┌──────────────┐
│  Personas   │         │     Core     │
│ Microservice│         │ Microservice │
└─────────────┘         └──────────────┘
     │                          │
     │ 1. Get student by device │
     │    (or CPF)              │
     │                          │
     │ 2. Bind device (if       │
     │    first time)           │
     │                          │
     └────────────┬─────────────┘
                  │
                  │ 3. POST /attendances
                  │    {qr_token, student_cpf, location}
                  │
                  ▼
           ┌──────────────┐
           │  Attendance  │
           │   Created    │
           └──────────────┘
```

## Casos de Uso

### 1. Primeira Vez (Device Binding)

**Cenário:** Estudante usando app pela primeira vez

**Request:**
```json
{
  "qr_token": "...",
  "device_id": "novo-dispositivo-uuid",
  "student_cpf": "12345678901",  // ✅ Obrigatório
  "location": {"latitude": -23.5505, "longitude": -46.6333}
}
```

**Fluxo:**
1. BFF tenta buscar estudante por `device_id` → **404 Not Found**
2. BFF busca estudante por `student_cpf` → **Encontrado**
3. BFF vincula `device_id` ao estudante automaticamente
4. BFF registra presença no Core
5. Retorna sucesso

### 2. Uso Regular

**Cenário:** Estudante com device já vinculado

**Request:**
```json
{
  "qr_token": "...",
  "device_id": "dispositivo-vinculado-uuid",
  // ❌ student_cpf não é necessário
  "location": {"latitude": -23.5505, "longitude": -46.6333}
}
```

**Fluxo:**
1. BFF busca estudante por `device_id` → **Encontrado**
2. BFF registra presença no Core
3. Retorna sucesso

### 3. Fora do Raio de Localização

**Request:**
```json
{
  "qr_token": "...",
  "device_id": "dispositivo-uuid",
  "location": {"latitude": -23.9999, "longitude": -46.9999}  // Longe do evento
}
```

**Response:**
```json
{
  "data": {
    "status": "success",
    "message": "Attendance registered, but you are outside the expected location radius.",
    "attendance": {
      "id": "...",
      "within_radius": false  // ⚠️ Fora do raio
    }
  }
}
```

## Validações do Core

O Core Microservice valida:

1. ✅ **Token JWT válido** (não expirado)
2. ✅ **Estudante matriculado na turma** do evento
3. ✅ **Evento está ativo** (não cancelado/fechado)
4. ✅ **Presença não duplicada** (não pode registrar duas vezes)
5. ⚠️ **Localização dentro do raio** (opcional, apenas warning)

## Erros Comuns

### QR Code Expirado
```json
{
  "code": "qr_invalid",
  "message": "QR code is invalid or expired",
  "trace_id": "..."
}
```

### Dispositivo Não Vinculado (sem CPF)
```json
{
  "code": "device_unbound",
  "message": "Device not bound. Please provide your CPF for first-time registration.",
  "trace_id": "..."
}
```

### Presença Duplicada
```json
{
  "code": "attendance_conflict",
  "message": "Attendance already registered",
  "trace_id": "..."
}
```

### Estudante Não Encontrado
```json
{
  "code": "not_found",
  "message": "Student with CPF 12345678901 not found",
  "trace_id": "..."
}
```

### Estudante Não Matriculado na Turma
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Student not enrolled in this class",
  "details": ["Student 123 is not enrolled in class 1"],
  "trace_id": "..."
}
```

## Segurança

1. **Sem Autenticação JWT**: Endpoint público para facilitar uso mobile
2. **Validação por QR Token**: Token JWT de curta duração (24h)
3. **Device Binding**: Vincula dispositivo ao CPF na primeira vez
4. **Validação de Matrícula**: Core verifica se estudante está na turma
5. **Validação de Localização**: Opcional, mas recomendado

## Integração com Microserviços

### Personas Microservice

**Endpoint:** `GET /students/device/{device_id}`
- Retorna estudante vinculado ao dispositivo
- Retorna 404 se dispositivo não vinculado

**Endpoint:** `GET /students/cpf/{cpf}`
- Retorna estudante por CPF
- Usado quando dispositivo não está vinculado

**Endpoint:** `POST /students/{id}/bind-device`
- Vincula dispositivo ao estudante
- Chamado automaticamente no primeiro scan

### Core Microservice

**Endpoint:** `POST /attendances`
```json
{
  "qr_token": "eyJhbGci...",
  "device_id": "uuid",
  "student_cpf": "12345678901",
  "location": {"latitude": -23.5505, "longitude": -46.6333}
}
```

**Validações do Core:**
- Decodifica e valida JWT do QR token
- Verifica se evento está ativo
- Consulta Personas para verificar matrícula
- Calcula distância se location fornecida
- Cria registro de presença
- Emite evento `attendance.created`

## Teste

Execute o script de teste:

```powershell
# Certifique-se que o servidor está rodando
npm run dev

# Em outro terminal
.\test-scan-endpoint.ps1
```

### Teste Manual com curl

```bash
# 1. Crie um evento
curl -X POST http://localhost:4000/v1/events \
  -H "Authorization: Bearer fake-token" \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 1,
    "teacher_id": 1,
    "start_time": "2025-10-27T10:00:00Z",
    "end_time": "2025-10-27T12:00:00Z",
    "location": {"latitude": -23.5505, "longitude": -46.6333}
  }'

# 2. Obtenha o QR token
curl -X GET http://localhost:4000/v1/events/{eventId}/qr \
  -H "Authorization: Bearer fake-token"

# 3. Registre presença
curl -X POST http://localhost:4000/v1/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qr_token": "<token-do-passo-2>",
    "device_id": "test-device-123",
    "student_cpf": "12345678901",
    "location": {"latitude": -23.5505, "longitude": -46.6333}
  }'
```

## Referências

- Swagger BFF: `docs/AKI! - BFF (Backend For Frontend) - Swagger.yaml`
- Swagger Core: `docs/AKI! - Microservice B (Core) - Swagger.yaml`
- Implementação: `src/application/use-cases/student/ScanQRUseCase.ts`
- Controller: `src/interface/controllers/StudentController.ts`
- Rotas: `src/interface/routes/scan.routes.ts`
