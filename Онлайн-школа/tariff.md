---
date: 2024-10-24
tags:
  - Онлайн-школа
---
# TariffModule

Модуль предназначен для проведения операций с тарифами.

## TariffController

В контроллере применяются следующие проверки

- ThrottlerGuard - ограничивает количество запросов от пользователя
- JWTGuard - проверят на валидность токен для доступа к методам
- SuperAdminRoleGuard - проверяет что у пользователя есть роль супер администратора

***

## Endpoints

Контроллер предоставляет следующие эндпоинты:

| Метод  | URL          | Описание             |
| ------ | ------------ | -------------------- |
| GET    | `tariff/`    | Получить все тарифы  |
| GET    | `tariff/:id` | Получить тариф по ID |
| POST   | `tariff/`    | Создать новый тариф  |
| PUT    | `tariff/:id` | Обновить тариф       |
| DELETE | `tariff/:id` | Удалить тариф        |

***

### Получить все тарифы

`GET tariff/`

*Входные данные:* -

*Функционал:*

Выполняет запрос к базе данных и получает все тарифы.

*Выходные данные:* Status: `200 OK`

Возвращает объекты, содержащие информацию о тарифах.

```json
{
  id: string;
  createdAt: Date;
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
  availableWidgets: Widget[];
}
```

```json
Widget {
  id: string;
  createdAt: Date;
  code: string;
  permissions: Record<string, unknown>;
  properties: Record<string, unknown>;
}
```

### Получить тариф по ID

`GET tariff/:id`

*Входные данные:*

- В URL запроса должен быть передан идентификатор тарифа - `id: string`

*Функционал:*

Выполняет запрос к базе данных для получения тарифа с указанным ID. Если такой тариф не найден, выбрасывает исключение NotFoundException с сообщением об ошибке "Тариф не найден".

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о тарифе.

```json
{
  id: string;
  createdAt: Date;
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
}
```

```json
Widget {
  id: string;
  createdAt: Date;
  code: string;
  permissions: Record<string, unknown>;
  properties: Record<string, unknown>;
}
```

### Создать новый тариф

`POST tariff/`

*Входные данные:*

- В тело запроса должны быть переданы следующие параметры (CreateTariffDto):

```json
{
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
  availableWidgets?: string;
}
```

*Функционал:*

Создает в базе данных новый тариф в соответствии с переданными параметрами и сохраняет его.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о созданном тарифе.

```json
{
  id: string;
  createdAt: Date;
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
}
```

```json
Widget {
  id: string;
  createdAt: Date;
  code: string;
  permissions: Record<string, unknown>;
  properties: Record<string, unknown>;
}
```

### Обновить тариф

`tariff/:id`

*Входные данные:*

- В URL запроса должен быть передан идентификатор тарифа - `id: string`
- В тело запроса должны быть переданы следующие параметры (UpdateTariffDto):

```json
{
  name?: string;
  period?: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
  availableWidgets?: string;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения тарифа с указанным ID. Если такой тариф не найден, выбрасывает исключение NotFoundException с сообщением об ошибке "Тариф не найден". Обновляет информацию о тарифе в соответствии с данными, переданными в запросе.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий обновленную информацию о тарифе.

```json
{
  id: string;
  createdAt: Date;
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
}
```

```json
Widget {
  id: string;
  createdAt: Date;
  code: string;
  permissions: Record<string, unknown>;
  properties: Record<string, unknown>;
}
```

### Удалить тариф

`DELETE tariff/:id`

*Входные данные:*

- В URL запроса должен быть передан идентификатор тарифа - `id: string`

*Функционал:*

Выполняет запрос к базе данных для получения тарифа с указанным ID. Если такой тариф не найден, выбрасывает исключение NotFoundException с сообщением об ошибке "Тариф не найден". Удаляет выбранный тариф из базы данных.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о удаленном тарифе.

```json
{
  id: string;
  createdAt: Date;
  name: string;
  period: TariffPeriod('ONE_MONTH', 'THREE_MONTHS', 'ONE_YEAR');
}
```

```json
Widget {
  id: string;
  createdAt: Date;
  code: string;
  permissions: Record<string, unknown>;
  properties: Record<string, unknown>;
}
```

***

## Зависимости (импортируемые модули)

- TypeOrmModule

***

## Используемый стэк

- JavaScript
- NestJS
- TypeScript
- Node.js