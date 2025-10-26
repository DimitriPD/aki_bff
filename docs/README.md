# AKI! BFF (Backend For Frontend)

## 🎯 Missão
Fornecer camada única otimizada para os microfrontends (Professor UI e Student UI), agregando e orquestrando dados dos serviços já hospedados:
- Personas (Identidades / Turmas): https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net
- Core (Eventos / Presenças / Ocorrências): https://aki-microservice-core-eta6esbzc5d9hze0.eastus2-01.azurewebsites.net
- Function (Password Recovery): https://aki-send-password-email-c8dcdae0bebab5br.eastus2-01.azurewebsites.net
- Function (Institution Notification): https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net

O BFF não persiste dados próprios: apenas composição, validação, normalização e redução de latência para o frontend.

---

## 🧩 Escopo Funcional (Contrato)
| Endpoint BFF | Origem Frontend | Chamada Downstream | Finalidade |
|--------------|-----------------|--------------------|------------|
| POST /auth/login | Professor UI | Personas (/teachers) ou mock | Autenticação simplificada |
| POST /auth/forgot-password | Professor UI | Function (Password Recovery) | Disparo de e-mail recuperação |
| POST /auth/reset-password | Professor UI | Personas (/teachers update) | Reset da senha após validação token |
| GET /teachers/me | Professor UI | Personas (/teachers/{id}, /classes) | Perfil + classes agregadas |
| GET /teachers/{id}/classes | Professor UI | Personas (/classes?teacher_id=) | Listagem turmas do professor |
| POST /events | Professor UI | Core (/events) | Criação evento + QR inicial |
| GET /events/{id} | Professor UI | Core (/events/{id}) + Personas (nomes) | Detalhe agregado |
| PUT /events/{id} | Professor UI | Core (/events/{id}) | Alterar horário/status |
| DELETE /events/{id} | Professor UI | Core (/events/{id}) | Cancelar evento |
| GET /events/{id}/qr | Professor UI | Core (/events/{id}/qr) | Renovar/obter token QR |
| POST /scan | Student UI | Core (/attendances) + Personas (device/cpf) | Registrar presença por QR |
| GET /attendances | Professor UI / Student UI | Core (/attendances) + Personas (nome aluno) | Listagem filtrada |
| GET /occurrences | Professor UI | Core (/occurrences) + Function (Notification) | Alertas e ocorrências |
| GET /classes/{id} | Professor UI | Personas (/classes/{id}) | Turma com membros |

---

## 🔗 Dependências Externas (Obrigatórias)
1. Personas Service: base para professores, estudantes, turmas, device binding.
2. Core Service: eventos, presenças, ocorrências, QR token (JWT).
3. Functions:
   - Password: fluxo recuperação/reset.
   - Institution Notification: recebimento / publicação de alertas (student_not_in_class).
4. (Futuro) Mensageria: consumo de eventos (event.created, attendance.created etc.).

---

## 🧱 Padrões Arquiteturais
- Clean Architecture + Vertical Slice (cada endpoint = pasta própria: controller, use case, mapper, validação).
- DTO interna ≠ contrato externo (adaptadores).
- Boundary: interface/http vs application/use-cases vs domain vs infrastructure.
- Idempotência lógica (não duplicar presenças).
- Observabilidade (log + trace_id em Error).

---

## 🗂 Estrutura Recomendada
src/
interface/
routes/
controllers/
middlewares/
application/
use-cases/
events/
attendance/
scan/
auth/
domain/
entities/
dto/
services/
infrastructure/
http/
clients/
personasClient.ts
coreClient.ts
functionsClient.ts
config/
adapters/
shared/
validation/
errors/
logger/
index.ts

---

## ✅ Regras de Orquestração (Resumo)
- Device first scan: se device não associado → resolver cpf → bind no Personas → prosseguir presença.
- Student não pertence à turma: Core cria occurrence → BFF pode repassar/enriquecer (se necessário) → possível POST para Function Notification (se não automatizado via evento).
- QR token inválido/expirado: retornar Error code=qr_invalid com detalhes (expirado | assinatura | evento encerrado).
- Nomes (professor/turma/aluno) devem ser resolvidos apenas quando requeridos pelo frontend (evitar N+1: usar batch/memoization curto).

---

## 🧪 Validações Chave
| Caso | Origem | Ação |
|------|--------|------|
| Overlap eventos | Core | Propagar 409 Conflict |
| CPF inválido | Personas | Mapear para 400 BadRequest |
| QR expirado | Core | 400 qr_invalid |
| Presença duplicada | Core | 409 already_registered |
| Turma não encontrada | Personas | 404 NotFound |
| Token recuperação inválido | Function Password | 400 token_invalid |

---

## 📦 Env Vars (Modelo .env)

PORT=4000
LOG_LEVEL=info
PERSONAS_BASE_URL=https://aki-microservice-personas-hwgjadgqfne2hafb.eastus2-01.azurewebsites.net
CORE_BASE_URL=https://aki-microservice-core-eta6esbzc5d9hze0.eastus2-01.azurewebsites.net
FUNCTION_PASSWORD_URL=https://aki-send-password-email-c8dcdae0bebab5br.eastus2-01.azurewebsites.net
FUNCTION_NOTIFICATION_URL=https://aki-notify-institution-a8gpgzf0b7bjhph4.eastus2-01.azurewebsites.net
JWT_SECRET=aki_mock_secret
REQUEST_TIMEOUT_MS=8000


---

## 🚀 Roadmap de Implementação (Prompt de Desenvolvimento)
1. Infra básica (Express + rotas + error handler + logger).
2. HTTP Clients (Axios) com:
   - Interceptores: correlation-id, retry simples (>= 500).
   - Timeout e tradução de erros.
3. Middlewares:
   - auth mock (injeta teacher_id fixo).
   - correlation-id (x-correlation-id).
4. Slices iniciais:
   - Auth: /auth/login (mock) /auth/forgot-password (Function) /auth/reset-password (Function + Personas).
   - Events: create/get/update/delete/qr (Core + enrich).
   - Scan: POST /scan (Core + fallback device binding via Personas).
5. Attendance list + enrich de nomes (cache in-memory TTL curto).
6. Occurrences list (Core) + possível agregação futura de notifications.
7. Classes detail (Personas) + normalização.
8. Padronizar Error: { code, message, details[], trace_id }.
9. Observabilidade mínima (log linha única JSON por request).
10. Testes unitários por use-case (mock clients).

---

## 🔍 Mapeamento de Erros (Sugestão)
| code | http | origem |
|------|------|--------|
| invalid_credentials | 401 | Personas |
| qr_invalid | 400 | Core |
| attendance_conflict | 409 | Core |
| not_found | 404 | Personas/Core |
| token_invalid | 400 | Function Password |
| device_unbound | 400 | Personas |
| internal_error | 500 | Genérico |

---

## 🧪 Exemplo Use Case (Pseudo)
```ts
async function registerScan(qrToken, deviceId, cpf?) {
  const student = await personasClient.resolveStudent(deviceId, cpf);
  const attendance = await coreClient.postAttendance({
    qr_token: qrToken,
    device_id: deviceId,
    student_cpf: student.cpf
  });
  return mapAttendance(attendance, student);
}

📏 Critérios de Conclusão MVP
Todos endpoints do Swagger BFF respondem e integram corretamente.
Latência média < 400ms em rotas simples (sem enrich).
Tratamento uniforme de erros com trace_id.
Logs com correlação (request_id).
Documentação atualizada (Swagger + README).
🔐 Segurança (Fase Atual)
JWT mock (teacher fixo) para rotas privadas.
/scan e /auth/* públicos.
Futuro: trocar para OAuth2 / real SSO.

🧪 Testar Manualmente (cURL)
curl -X POST http://localhost:4000/v1/events -H "Authorization: Bearer MOCK" -d '{"class_id":1,"teacher_id":10,"start_time":"2025-10-26T12:00:00Z","end_time":"2025-10-26T13:00:00Z","location":{"latitude":-23.5,"longitude":-46.6}}'