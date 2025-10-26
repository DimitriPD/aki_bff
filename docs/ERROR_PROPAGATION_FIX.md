# Error Propagation - Before vs After

## Problema Anterior

### Core retornava:
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

### BFF propagava (❌ ERRADO):
```json
{
  "code": "upstream_error",                    // ❌ Código genérico
  "message": "Request failed with status code 400",  // ❌ Mensagem genérica
  "trace_id": "1761515707548-klfpv3niw",
  "timestamp": "2025-10-26T21:55:08.239Z"
  // ❌ Sem detalhes!
}
```

## Solução Implementada

### Código Atualizado (HttpClient.ts)

```typescript
// Antes:
const data = error.response.data as any;
throw new AppError(
  status,
  data?.code || 'upstream_error',  // ❌ Pega 'undefined', usa fallback
  data?.message || error.message,  // ❌ Pega 'undefined', usa fallback
  data?.details,                   // ❌ Sempre undefined
  correlationId,
);

// Depois:
const data = error.response?.data as any;
const errorData = data?.error || data;  // ✅ Extrai campo 'error' se existir
throw new AppError(
  status,
  errorData?.code || 'upstream_error',     // ✅ Pega 'VALIDATION_ERROR'
  errorData?.message || error.message,     // ✅ Pega 'Invalid event data'
  errorData?.details,                      // ✅ Pega array de detalhes
  correlationId,
);
```

### BFF agora propaga (✅ CORRETO):
```json
{
  "code": "VALIDATION_ERROR",              // ✅ Código específico
  "message": "Invalid event data",         // ✅ Mensagem do Core
  "details": [                              // ✅ Detalhes preservados!
    "start_time: Start time must be before end time",
    "start_time: Cannot create events in the past"
  ],
  "trace_id": "correlation-id",
  "timestamp": "2025-10-26T21:55:08.239Z"
}
```

## Compatibilidade

A solução funciona com **ambos os formatos**:

### Formato 1 (Core): Erro aninhado
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": [...]
  }
}
```
✅ Extrai `data.error`

### Formato 2 (Personas): Erro direto
```json
{
  "code": "not_found",
  "message": "Teacher not found"
}
```
✅ Usa `data` diretamente

## Teste

Execute o script de teste:

```powershell
# Reinicie o servidor
npm run dev

# Em outro terminal:
.\test-error-propagation.ps1
```

### Resultado Esperado

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid event data",
  "details": [
    "start_time: Start time must be before end time",
    "start_time: Cannot create events in the past"
  ],
  "trace_id": "...",
  "timestamp": "..."
}
```

## Benefícios

1. ✅ **Frontend recebe erros específicos** do microserviço
2. ✅ **Validações são exibidas corretamente** ao usuário
3. ✅ **Debug facilitado** com mensagens originais
4. ✅ **Compatível com múltiplos formatos** de API
5. ✅ **Mantém rastreabilidade** com correlation IDs
