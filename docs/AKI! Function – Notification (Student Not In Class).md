# AKI! Function – Notification (Student Not In Class)

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Purpose
Azure Function to receive, validate, persist, and publish notifications when a student attempts to check in to a class they are not assigned to.

## Flow
1. Receives HTTP POST at `/api/notification`
2. Validates payload using Zod schema
3. Persists notification in Azure SQL (via Sequelize)
4. Publishes event to Azure Service Bus topic (`institution.notifications`)
5. Returns HTTP 201 with confirmation

## Getting Started

### Prerequisites
- Node.js >= 18
- Azure Functions Core Tools
- Azure SQL Database
- Azure Service Bus

### Setup
1. Clone the repository:
  ```bash
  git clone https://github.com/CamilaDLRS/aki_function_notify_institution.git
  cd aki_function_notify_institution
  ```
2. Copy `.env.example` to `.env` and fill in your credentials:
  ```bash
  cp .env.example .env
  # Edit .env with your DB and Service Bus credentials
  ```
3. Install dependencies:
  ```bash
  npm install
  ```
4. Run database migrations (if using Knex):
  ```bash
  npm run migrate
  ```
5. Start the function locally:
  ```bash
  npm run build
  func start
  ```

## Example Request
```bash
curl -X POST http://localhost:7071/api/notification \
  -H "Content-Type: application/json" \
  -d '{
    "class_id": 12,
    "teacher_id": 45,
    "message": "Student attempted to register presence but is not part of the class"
  }'
```

## Example Response
```json
{
  "status": "received",
  "notification_id": 1024,
  "published_to_bus": true
}
```

## Azure Bindings
See `notification/function.json` for HTTP trigger and output bindings. Endpoint is `/api/notification`.

## Environment Variables
See `.env.example` for all required variables:

- Database connection: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, etc.
- Service Bus: `SERVICEBUS_CONNECTION_STRING`, `SERVICEBUS_TOPIC`
- Logging: `LOG_LEVEL`

## Logging
Structured logs with correlation IDs. See `src/shared/logger.ts`.

## Retry & Idempotency
Retries for SQL/Service Bus are handled in repository/publisher. Idempotency can be extended by checking for duplicate events (extend schema as needed).

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT