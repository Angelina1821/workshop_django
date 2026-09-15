# Workshop Booking System — NestJS

Учебный проект системы бронирования мастер-классов, переписанный с Django REST Framework на NestJS в рамках домашнего задания 2.

## Стек
- TypeScript
- NestJS
- TypeORM
- PostgreSQL 17
- JWT / Passport
- class-validator / class-transformer
- Docker / Docker Compose
- Postman

## Возможности
- регистрация и JWT-авторизация;
- роли `USER` и `ADMIN`;
- публичный просмотр мастер-классов и аудиторий;
- CRUD мастер-классов для администратора;
- создание аудиторий для администратора;
- создание бронирований авторизованными пользователями;
- просмотр своих бронирований;
- просмотр всех бронирований администратором;
- отмена бронирования без физического удаления;
- запрет бронирования прошедшего мастер-класса;
- запрет дублирования активной брони;
- контроль вместимости мастер-класса.

## Архитектура

`src` разделён на модули `auth`, `users`, `workshops`, `bookings`. HTTP-слой находится в контроллерах, бизнес-правила — в сервисах, входные данные — в DTO, структура БД — в TypeORM Entity.

### Сущности
- `User` → `Booking`: OneToMany / ManyToOne;
- `Workshop` → `Booking`: OneToMany / ManyToOne;
- `Classroom` → `Workshop`: OneToMany / ManyToOne.

Для активных бронирований используется уникальный частичный индекс по `(user_id, workshop_id)`. Создание брони выполняется внутри транзакции с блокировкой мастер-класса `pessimistic_write`, чтобы параллельные запросы не превышали вместимость.

## Запуск

Создайте `.env` по примеру `.env.example`:

```env
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=workshop
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=change_me_for_local_development
```

Запустите:

```bash
docker compose up --build -d
```

API: `http://localhost:3000/api`

Схема БД создаётся TypeORM через `synchronize: true`, что подходит для учебного проекта.

## API

### Auth

`POST /api/auth/register`

```json
{"username":"testuser","password":"Test12345"}
```

`POST /api/auth/login` возвращает `access_token`.

Для защищённых запросов используется:

`Authorization: Bearer <token>`

### Workshops

- `GET /api/workshops` — список;
- `GET /api/workshops/:id` — детали;
- `POST /api/workshops/create` — ADMIN;
- `PUT /api/workshops/:id` — ADMIN;
- `DELETE /api/workshops/:id` — ADMIN;
- `GET /api/workshops/classrooms` — список аудиторий;
- `POST /api/workshops/createclass` — ADMIN.

### Bookings

- `POST /api/bookings/create` — авторизованный пользователь;
- `GET /api/bookings` — свои брони, ADMIN видит все;
- `DELETE /api/bookings/:id` — отмена собственной брони.

При создании бронирования проверяются дата мастер-класса, наличие активной записи и свободные места.

## Тестирование

```bash
npm install
npm test
```

Postman-коллекция размещена в `postman/`.

## Создание ADMIN для демонстрации

Регистрация создаёт `USER`. После регистрации роль можно установить для локальной демонстрации:

```bash
docker compose exec db psql -U postgres -d workshop -c "UPDATE users SET role='ADMIN' WHERE username='admin';"
```

После изменения роли нужно выполнить повторный login и получить новый JWT.
