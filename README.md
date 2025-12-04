# CashFlow API

CashFlow API — серверное приложение на **NestJS + TypeORM + PostgreSQL**, упакованное в Docker и готовое к локальному запуску через Docker Compose.  
Проект предоставляет REST API для управления категориями, транзакциями и авторизацией пользователей.

## Запуск в Docker Container

Убедись, что у тебя есть файл `.env.docker` — он используется **только при запуске через Docker**.

```bash
# Сборка и запуск контейнера
docker compose up --build

# Остановка контейнера
docker compose down
```

## Запуск в режиме разработки без Докера

```bash
npm install
npm run start:dev
```

### Приложения

Доступные ссылки:

- [http://localhost:8081/api/v1/status](http://localhost:8081/api/v1/status) - API Root
- [http://localhost:8081/api/v1/swagger](http://localhost:8081/api/v1/swagger) - Swagger Docs
- [http://localhost:8081/api/v1/swagger/json](http://localhost:8081/api/v1/swagger/json) - JSON OpenAPI spec
- [http://localhost:8081/api/v1/swagger/yaml](http://localhost:8081/api/v1/swagger/yaml) - YAML OpenAPI spec

## Features

- Auth
  - Sign-up
  - Sign-in
- Categories
  - Add new Category
  - Edit Category
  - Delete Category
- Transactions
  - Add new Transaction

## Endpoints

| Endpoint                 | Method | Function               |
| ------------------------ | ------ | ---------------------- |
| /api/v1/auth/sign-up     | POST   | Sign-up (create user)  |
| /api/v1/auth/sign-in     | POST   | Sign-in (login user)   |
| /api/v1/auth/sign-out    | POST   | Sign-out (logout user) |
| /api/v1/categories       | POST   | Add new Category       |
| /api/v1/categories       | GET    | Get all Categories     |
| /api/v1/categories/:id   | GET    | Get Category by ID     |
| /api/v1/categories/:id   | PATCH  | Edit Category          |
| /api/v1/categories/:id   | DELETE | Delete Category        |
| /api/v1/transactions     | POST   | Add new Transaction    |
| /api/v1/transactions     | GET    | Get all Transactions   |
| /api/v1/transactions/:id | GET    | Get Transaction by ID  |
