# Arquitetura BFF - Backend For Frontend

## 📋 Visão Geral

Este BFF (Backend For Frontend) foi projetado para **agregar dados** de múltiplos microserviços (Personas e Core) e Azure Functions, fornecendo endpoints otimizados para as necessidades específicas do frontend.

Ao invés de fazer proxy 1:1 dos microserviços, o BFF:
- ✅ **Agrega dados** de múltiplas fontes em uma única chamada
- ✅ **Reduz round-trips** entre frontend e backend
- ✅ **Enriquece respostas** com dados relacionados
- ✅ **Calcula estatísticas** e métricas úteis para o UI
- ✅ **Formata dados** no formato ideal para cada tela do frontend

---

## 🎯 Endpoints Agregados

### 1. **GET `/v1/teachers/{id}` - Dashboard do Professor**

**Objetivo:** Fornecer todos os dados necessários para a tela principal do professor em uma única chamada.

**Agrega dados de:**
- ✅ Personas: Dados do professor
- ✅ Personas: Lista de turmas do professor
- ✅ Core: Eventos próximos (agendados)
- ✅ Core: Eventos recentes (concluídos)
- ✅ Core: Ocorrências recentes
- ✅ Core: Estatísticas de presenças

**Resposta:**
```json
{
  "teacher": {
    "id": 1,
    "full_name": "João Silva",
    "email": "joao@escola.com"
  },
  "classes": [
    {
      "id": 10,
      "name": "Turma A - Matemática",
      "student_count": 35
    }
  ],
  "upcoming_events": [
    {
      "id": "evt_123",
      "class_id": 10,
      "class_name": "Turma A - Matemática",
      "start_time": "2025-10-27T08:00:00Z",
      "end_time": "2025-10-27T10:00:00Z",
      "status": "scheduled",
      "location": { "latitude": -23.5505, "longitude": -46.6333 }
    }
  ],
  "recent_occurrences": [
    {
      "id": "occ_456",
      "type": "automatic",
      "class_id": 10,
      "student_cpf": "12345678901",
      "description": "Student not in class",
      "created_at": "2025-10-26T09:30:00Z"
    }
  ],
  "stats": {
    "total_classes": 3,
    "total_events": 45,
    "total_attendances": 1203,
    "total_occurrences": 8
  }
}
```

**Benefícios:**
- Frontend carrega dashboard completo em 1 chamada ao invés de 5+
- Dados já enriquecidos (nomes de turmas nos eventos)
- Estatísticas calculadas no backend

---

### 2. **GET `/v1/students/{id}` - Perfil do Aluno**

**Objetivo:** Fornecer perfil completo do aluno com histórico de presenças e turmas matriculadas.

**Agrega dados de:**
- ✅ Personas: Dados do aluno
- ✅ Personas: Turmas em que está matriculado
- ✅ Core: Histórico de presenças
- ✅ Core: Taxa de frequência calculada

**Resposta:**
```json
{
  "student": {
    "id": 100,
    "cpf": "12345678901",
    "full_name": "Maria Santos",
    "device_id": "device_abc123",
    "created_at": "2025-01-15T10:00:00Z"
  },
  "enrolled_classes": [
    {
      "id": 10,
      "name": "Turma A - Matemática"
    },
    {
      "id": 15,
      "name": "Turma B - Português"
    }
  ],
  "recent_attendances": [
    {
      "id": "att_789",
      "event_id": "evt_456",
      "timestamp": "2025-10-26T08:05:00Z",
      "status": "recorded"
    }
  ],
  "stats": {
    "total_classes": 2,
    "total_attendances": 87,
    "attendance_rate": 92
  }
}
```

**Benefícios:**
- Perfil completo em 1 chamada
- Taxa de frequência calculada automaticamente
- Lista de turmas já resolvida

---

### 3. **GET `/v1/classes/{id}` - Detalhes da Turma**

**Objetivo:** Fornecer visão completa da turma com membros, eventos e estatísticas.

**Agrega dados de:**
- ✅ Personas: Dados da turma
- ✅ Personas: Lista de alunos
- ✅ Personas: Lista de professores
- ✅ Core: Eventos recentes
- ✅ Core: Eventos próximos
- ✅ Core: Taxa média de presença

**Resposta:**
```json
{
  "class": {
    "id": 10,
    "name": "Turma A - Matemática",
    "created_at": "2025-01-10T00:00:00Z",
    "updated_at": "2025-01-10T00:00:00Z"
  },
  "students": [
    {
      "id": 100,
      "cpf": "12345678901",
      "full_name": "Maria Santos",
      "device_id": "device_abc123"
    }
  ],
  "teachers": [
    {
      "id": 1,
      "full_name": "João Silva",
      "email": "joao@escola.com"
    }
  ],
  "recent_events": [
    {
      "id": "evt_789",
      "start_time": "2025-10-25T08:00:00Z",
      "end_time": "2025-10-25T10:00:00Z",
      "status": "closed"
    }
  ],
  "upcoming_events": [
    {
      "id": "evt_123",
      "start_time": "2025-10-27T08:00:00Z",
      "end_time": "2025-10-27T10:00:00Z",
      "status": "scheduled"
    }
  ],
  "stats": {
    "total_students": 35,
    "total_teachers": 2,
    "total_events": 48,
    "average_attendance_rate": 88
  }
}
```

**Benefícios:**
- Visão completa da turma em 1 chamada
- Membros + eventos + estatísticas agregados
- Taxa de presença média já calculada

---

### 4. **GET `/v1/events/{eventId}` - Detalhes do Evento com Presenças**

**Objetivo:** Fornecer detalhes completos do evento incluindo lista de presenças e alunos ausentes.

**Agrega dados de:**
- ✅ Core: Dados do evento
- ✅ Core: Lista de presenças
- ✅ Personas: Dados da turma
- ✅ Personas: Dados do professor
- ✅ Personas: Lista completa de alunos da turma
- ✅ Cálculo: Alunos ausentes (diff entre lista da turma e presenças)

**Resposta:**
```json
{
  "event": {
    "id": "evt_123",
    "class_id": 10,
    "class_name": "Turma A - Matemática",
    "teacher_id": 1,
    "teacher_name": "João Silva",
    "start_time": "2025-10-26T08:00:00Z",
    "end_time": "2025-10-26T10:00:00Z",
    "location": { "latitude": -23.5505, "longitude": -46.6333 },
    "status": "closed",
    "qr_token": "token_xyz789"
  },
  "attendances": [
    {
      "id": "att_789",
      "student_id": 100,
      "student_name": "Maria Santos",
      "student_cpf": "12345678901",
      "timestamp": "2025-10-26T08:05:00Z",
      "status": "recorded",
      "within_radius": true
    }
  ],
  "absent_students": [
    {
      "id": 101,
      "cpf": "98765432100",
      "full_name": "Pedro Oliveira"
    }
  ],
  "stats": {
    "total_students": 35,
    "total_attendances": 32,
    "attendance_rate": 91,
    "on_time_attendances": 30,
    "absent_count": 3
  }
}
```

**Benefícios:**
- Lista completa de presenças com nomes dos alunos
- Lista de ausentes calculada automaticamente
- Estatísticas do evento prontas para exibição
- Dados enriquecidos (nomes de turma e professor)

---

### 5. **POST `/v1/scan` - Registro de Presença (QR Scan)**

**Objetivo:** Processar scan de QR code com validação e enriquecimento de dados.

**Agrega dados de:**
- ✅ Personas: Busca aluno por device_id ou CPF (opcional)
- ✅ Personas: Auto-bind de device se necessário
- ✅ Core: Validação e registro de presença
- ✅ Core: Validação de localização

**Fluxo:**
1. Tenta buscar aluno no Personas por device_id
2. Se não encontrar, tenta por CPF (se fornecido)
3. Se encontrar, tenta fazer bind do device (melhor esforço)
4. Registra presença no Core (Core valida o QR token e evento)
5. Retorna resposta enriquecida com nome do aluno

**Resposta:**
```json
{
  "status": "success",
  "message": "Attendance registered successfully!",
  "attendance": {
    "id": "att_new123",
    "event_id": "evt_456",
    "student_name": "Maria Santos",
    "timestamp": "2025-10-26T08:05:00Z",
    "within_radius": true
  }
}
```

**Benefícios:**
- Auto-bind de dispositivo quando possível
- Validação em múltiplas fontes
- Resposta user-friendly com nome do aluno
- Tratamento robusto de erros

---

## 🏗️ Arquitetura dos Use Cases

### Padrão de Agregação

Cada use case agregado segue este padrão:

```typescript
export class GetClassDetailsUseCase {
  private personasClient: PersonasClient;
  private coreClient: CoreClient;

  async execute(classId: number, correlationId: string) {
    // 1. Buscar dados de múltiplas fontes em paralelo
    const [classWithMembers, recentEvents, upcomingEvents] = await Promise.all([
      this.personasClient.getClassWithMembers(classId),
      this.coreClient.getEvents({ class_id: classId, status: 'closed' }),
      this.coreClient.getEvents({ class_id: classId, status: 'scheduled' }),
    ]);

    // 2. Processar e enriquecer dados
    const enrichedData = await this.enrichData(classWithMembers, recentEvents);

    // 3. Calcular estatísticas
    const stats = this.calculateStats(classWithMembers, recentEvents);

    // 4. Retornar resposta agregada
    return {
      class: classWithMembers,
      events: enrichedData,
      stats,
    };
  }
}
```

### Benefícios da Arquitetura

1. **Redução de Latência**
   - Chamadas paralelas com `Promise.all()`
   - Menos round-trips entre frontend e backend

2. **Dados Enriquecidos**
   - IDs substituídos por nomes legíveis
   - Estatísticas calculadas no backend

3. **Manutenibilidade**
   - Lógica de agregação centralizada
   - Fácil adicionar novos campos

4. **Performance**
   - Cache pode ser implementado nos use cases
   - Consultas otimizadas

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes (Proxy 1:1)

Frontend precisa fazer **6 chamadas** para carregar dashboard do professor:

```javascript
// 1. Buscar professor
const teacher = await api.get('/teachers/1');

// 2. Buscar turmas do professor
const classes = await api.get('/teachers/1/classes');

// 3. Buscar eventos de cada turma
for (const cls of classes) {
  const events = await api.get(`/events?class_id=${cls.id}`);
}

// 4. Buscar presenças de cada evento
for (const event of events) {
  const attendances = await api.get(`/attendances?event_id=${event.id}`);
}

// 5. Buscar ocorrências
const occurrences = await api.get(`/occurrences?teacher_id=1`);

// 6. Calcular estatísticas no frontend
const stats = calculateStats(events, attendances);
```

**Problemas:**
- 6+ chamadas HTTP
- Alto tempo de carregamento (latência acumulada)
- Lógica de agregação no frontend
- Dados brutos sem enriquecimento

---

### ✅ Depois (BFF Agregado)

Frontend precisa fazer **1 chamada** para carregar dashboard do professor:

```javascript
// 1 única chamada retorna tudo
const dashboard = await api.get('/teachers/1');

// Dados já vêm agregados, enriquecidos e com estatísticas
console.log(dashboard.teacher);           // Dados do professor
console.log(dashboard.classes);           // Turmas com student_count
console.log(dashboard.upcoming_events);   // Eventos com class_name
console.log(dashboard.recent_occurrences);// Ocorrências já filtradas
console.log(dashboard.stats);             // Estatísticas calculadas
```

**Benefícios:**
- ✅ 1 única chamada HTTP
- ✅ Latência reduzida (chamadas paralelas no backend)
- ✅ Dados enriquecidos (nomes ao invés de IDs)
- ✅ Estatísticas já calculadas
- ✅ Frontend mais simples e rápido

---

## 🎨 Endpoints por Tela do Frontend

### Tela: Dashboard do Professor
- **Endpoint:** `GET /v1/teachers/{id}`
- **Dados:** Perfil + turmas + eventos + ocorrências + estatísticas

### Tela: Detalhes da Turma
- **Endpoint:** `GET /v1/classes/{id}`
- **Dados:** Turma + alunos + professores + eventos + estatísticas

### Tela: Detalhes do Evento
- **Endpoint:** `GET /v1/events/{eventId}`
- **Dados:** Evento + presenças + ausentes + estatísticas

### Tela: Perfil do Aluno
- **Endpoint:** `GET /v1/students/{id}`
- **Dados:** Aluno + turmas + histórico de presenças + taxa de frequência

### Ação: Scan QR Code
- **Endpoint:** `POST /v1/scan`
- **Dados:** Validação + registro + enriquecimento

---

## 🚀 Próximos Passos

1. **Cache**: Implementar cache em memória (Redis) para dados frequentes
2. **Paginação**: Adicionar paginação inteligente nos use cases
3. **GraphQL**: Considerar migração para GraphQL para consultas ainda mais flexíveis
4. **Webhooks**: Implementar webhooks para notificações em tempo real
5. **Analytics**: Adicionar mais estatísticas e insights nos use cases

---

## 📝 Conclusão

O BFF agora funciona como esperado: **agrega dados de múltiplos microserviços** e fornece endpoints otimizados para cada tela do frontend, reduzindo latência e complexidade no cliente.
