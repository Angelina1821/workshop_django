# Workshop Booking System

Учебный проект REST API для записи пользователей на мастер-классы.

## Стек

- Python 3.12
- Django 6.1
- Django REST Framework
- PostgreSQL 17
- Docker / Docker Compose
- Postman

## Возможности

### Пользователь

- регистрация и авторизация;
- просмотр мастер-классов;
- запись на мастер-класс;
- просмотр своих записей;
- отмена записи.

### Администратор

- создание мастер-классов;
- просмотр мастер-классов;
- редактирование мастер-классов;
- удаление мастер-классов;
- просмотр записей всех пользователей.


Бизнес-логика создания бронирования вынесена в `bookings/services.py`.

## Запуск проекта

### 1. Создать `.env`

В корне проекта создать файл `.env`:

```env
POSTGRES_DB=workshop
POSTGRES_USER=dba
POSTGRES_PASSWORD=sql
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

### 2. Запустить Docker

```bash
docker compose up --build
```

API будет доступно по адресу:

```text
http://localhost:8000/
```

### 3. Выполнить миграции

```bash
docker compose exec web python manage.py migrate
```

### 4. Создать администратора

```bash
docker compose exec web python manage.py createsuperuser
```

После создания пользователя установить ему роль `ADMIN`.

Это можно сделать через Django shell:

```bash
docker compose exec web python manage.py shell
```

```python
from users.models import User

user = User.objects.get(username='admin')
user.role = User.Role.ADMIN
user.save()
```
```python
exit()
```
## Авторизация

Используется Token Authentication. Также настроена базовая авторизация.

После получения токена передавать его в заголовке:

```text
Authorization: Token <token>
```

---

# API

## 1. Регистрация
В постман создайте нового ползователя.

```http
POST http://localhost:8000/api/auth/register/
```

Body → `raw` → `JSON`:

```json
{
    "username": "testuser",
    "password": "Test12345!"
}
```

---

## 2. Авторизация
Далее можно авторизоваться используя учетные данные пользоватея. Отвеным сообщением плучите токен пользователя. Для того, чтобы получить токен пользователя с правами админ, авториуйтесь с указанием учетных данных, которые вы задали при создании суперпользователя.

```http
POST http://localhost:8000/api/auth/login/
```

Body:

```json
{
    "username": "testuser",
    "password": "Test12345!"
}
```

Ответ:

```json
{
    "token": "..."
}
```

Полученный токен использовать для авторизованных запросов.

---

# Мастер-классы

## Получить список мастер-классов

```http
GET http://localhost:8000/api/workshops/
```

Доступно без авторизации.

## Получить мастер-класс

```http
GET http://localhost:8000/api/workshops/1/
```

Доступно без авторизации.

## Создать мастер-класс

Только `ADMIN`.

```http
POST http://localhost:8000/api/workshops/create/
```

Header:

```text
Authorization: Token <admin_token>
```

Body:

```json
{
    "title": "Основы Python",
    "descr": "Вводный практический воркшоп по Python",
    "date": "2026-10-20T18:00:00Z",
    "capacity": 15,
    "classroom": 1
}
```

## Изменить мастер-класс

Только `ADMIN`.

```http
PUT http://localhost:8000/api/workshops/1/
```

Header:

```text
Authorization: Token <admin_token>
```

Body:

```json
{
    "title": "Основы Python — обновлённый курс",
    "descr": "Новое описание воркшопа",
    "date": "2026-10-20T18:00:00Z",
    "capacity": 15,
    "classroom": 1
}
```

## Удалить мастер-класс

Только `ADMIN`.

```http
DELETE http://localhost:8000/api/workshops/1/
```

Header:

```text
Authorization: Token <admin_token>
```

---

# Бронирования

## Создать бронирование

Только авторизованный пользователь.

```http
POST http://localhost:8000/api/bookings/create/
```

Header:

```text
Authorization: Token <user_token>
```

Body:

```json
{
    "workshop": 1
}
```

При создании проверяется:

- мастер-класс ещё не прошёл;
- у пользователя нет активной записи;
- есть свободные места.

## Получить бронирования

```http
GET http://localhost:8000/api/bookings/
```

Header:

```text
Authorization: Token <user_token>
```

Обычный пользователь получает только свои записи.

Администратор получает записи всех пользователей.

В ответе содержится информация о связанном мастер-классе.

## Отменить бронирование

```http
DELETE http://localhost:8000/api/bookings/1/
```

Header:

```text
Authorization: Token <user_token>
```

Бронирование не удаляется из базы, а переводится в статус:

```text
CANCELLED
```

После отмены пользователь может снова записаться на тот же мастер-класс.

---

# Основные проверки

Проект проверяет следующие сценарии:

- регистрация пользователя;
- авторизация;
- просмотр мастер-классов без авторизации;
- создание мастер-класса администратором;
- запрет создания мастер-класса обычным пользователем;
- редактирование и удаление мастер-класса администратором;
- создание бронирования;
- запрет записи на прошедший мастер-класс;
- запрет повторной активной записи;
- ограничение количества участников;
- просмотр своих бронирований;
- просмотр всех бронирований администратором;
- отмена бронирования;
- повторная запись после отмены;
- запрет доступа неавторизованным пользователям.

## Оптимизация

Для получения бронирований используется `select_related()`:

```python
Booking.objects.select_related(
    'user',
    'workshop',
    'workshop__classroom'
)
```

Для создания бронирования используются:

```python
transaction.atomic()
```

и

```python
select_for_update()
```

что позволяет корректно обрабатывать одновременные попытки занять последнее свободное место.

## Postman

Для проверки API подготовлена Postman Collection с запросами:

- регистрация;
- авторизация;
- получение мастер-классов;
- создание/изменение/удаление мастер-классов;
- создание бронирования;
- просмотр бронирований;
- отмена бронирования.

```

Также добавлены автоматические проверки HTTP-ответов, например:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

## Переменные окружения

Данные PostgreSQL хранятся в `.env` и не должны добавляться в Git.

```text
.env
```

добавлен в `.gitignore`.