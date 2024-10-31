---
date: 2024-10-11
tags:
  - Онлайн-школа
outline: [2, 4]
---
# PopupModule

Управляет событиями WebSocket, связанными с уведомлениями: обрабатывает действия пользователей (чтение и скрытие), отправляет новые уведомления пользователям. Состоит из следующих компонентов:

1. [PopupGateway](#PopupGateway)
2. [PopupController](#PopupController)
3. [PopupService](#PopupService)

## PopupGateway

Для защиты WebSocket соединений применяется `WsJwtGuard`. Используется пространство имен `popups`, разрешены кросс-доменные запросы.

***

### Handlers

Шлюз обрабатывает следующие события:

| Событие       | Описание                              |
| ------------- | ------------------------------------- |
| `read`        | Отметить уведомление, как прочитанное |
| `do_not_show` | Скрыть уведомление                    |

***

### Отметить уведомление, как прочитанное

`read`

*Входные данные:* В тело сообщения должны быть отправлены следующие параметры:

- Идентификатор уведомления (DoNotShowDto):

```json
{
  popupId: string;
}
```

- Информация о пользователе (UserPayloadInterface):

```json
{
  id: string;
  email?: string | null;
  roleId: string;
  roleCode: string;
  isSuperAdmin: boolean;
  status: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  sessionId: string;
}
```

*Функционал:*

Вызывает метод [read](#read), который записывает в базу данных, в сущность PopupView `popupId` и `userId`, переданные в сообщении. Если данные уже присутствуют, пропускает действие.

*Выходные данные:* -

### Скрыть уведомление

`do_not_show`

*Входные данные:* В тело сообщения должны быть отправлены следующие параметры:

- Идентификатор уведомления (DoNotShowDto):

```json
{
  popupId: string;
}
```

- Информация о пользователе (UserPayloadInterface):

```json
{
  id: string;
  email?: string | null;
  roleId: string;
  roleCode: string;
  isSuperAdmin: boolean;
  status: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  sessionId: string;
}
```

*Функционал:*

Вызывает метод [doNotShow](#doNotShow), который меняет значение параметра `doNotShowAgain` на `true` для уведомления с переданным идентификатором, для конкретного пользователя.

*Выходные данные:* -

## PopupController

В контроллере применяются следующие проверки:

- JWTGuard - проверят на валидность токен для доступа к методам
- SuperAdminRoleGuard - проверяет что у пользователя есть роль супер администратора

***

### Endpoints

Контроллер предоставляет следующий эндпоинт:

| Метод | URL      | Описание                           |
| ----- | -------- | ---------------------------------- |
| POST  | `popup/` | Отправка уведомлений пользователям |

***

### Отправка уведомлений пользователям

`POST popup/`

*Входные данные:* -

*Функционал:*

Метод создает запрос к базе данных для получения списка уведомлений, которые должны соответствовать следующим критериям:

- Статус уведомления ACTIVE
- Дата и час совпадают с текущим временем или время соответствует временному интервалу показа уведомлений (`popup.interval`).
- Если для уведомления не указан класс или тарифный план, оно будет доступно для всех пользователей. Если же уведомление связано с конкретным классом или тарифом, то оно будет доступно только тем пользователям, которые соответствуют этим критериям.

Метод получает из базы данных список текущих пользователей и соответствующие им уведомления. Для каждого пользователя фильтруются уведомления с пустым идентификатором, затем отправляется событие `new_popup` с массивом уведомлений в комнату, связанную с конкретным пользователем.

*Выходные данные:* -

## PopupService

Предоставляет следующие методы:

| Имя                   | Описание                                           |
| --------------------- | -------------------------------------------------- |
| getWithViews          | Получить уведомления с количеством просмотров      |
| getCurrentUsers       | Получить список пользователей и их уведомления     |
| getCurrentPopups      | Получить уведомления с заголовком и текстом        |
| getCurrentPopupsQuery | Получить уведомления                               |
| getOneWithRelations   | Получить уведомления с отношениями                 |
| getById               | Найти уведомление по ID                            |
| create                | Создать уведомление                                |
| update                | Обновить информацию об уведомлении                 |
| read                  | Пометить уведомление как прочитаное                |
| doNotShow             | Изменить параметр уведомления больше не показывать |
| delete                | Удалить уведомление                                |

### getWithViews

*Входные данные:*

- Параметры для получения уведомлений GetPopupsParams, с информацией о пагинации PaginationDto:

```json
{
  status: PopupStatus('ACTIVE', 'INACTIVE');
  limit?: number;
  offset?: number;
}
```

*Функционал:*

Отправляет запрос к базе данных для получения уведомлений с информацией о количестве просмотров. Сортирует уведомления по дате начала показа в порядке убывания.

*Выходные данные:*

Возвращает объект, содержащий массив данных об уведомлениях с информацией о просмотрах, а также количество объектов в массиве.

```json
{
  results: PopupWithViews[];
  count: number;
}
```

PopupWithViews:

```json
{
  id: string;
  title: string;
  status: PopupStatus('ACTIVE', 'INACTIVE');
  dateStart: Date;
  createdAt: Date;
  viewsCount: number;
}
```

### getCurrentUsers

*Входные данные:*

- Информация о пагинации:

```json
{
  limit: number;
  offset: number;
}
```

*Функционал:*

Находит в базе данных пользователей и соответствующие им уведомления, в соответствии с информацией о пагинации.

*Выходные данные:*

Возвращает объекты, содержащие идентификаторы пользователей и массивы с идентификаторами их уведомлений.

```json
{
  userId: string;
  popupsId: string[];
}
```

### getCurrentPopups

*Входные данные:* -

*Функционал:*

Вызывает метод [getCurrentPopupsQuery](#getCurrentPopupsQuery) для получения активных уведомлений, добавляет к ним поля `title` и `text`

*Выходные данные:*

Возвращает объект с информацией о уведомлении:

```json
{
  popupId: string;
  title: string;
  text: string;
}
```

### getCurrentPopupsQuery

*Входные данные:* -

*Функционал:*

Выполняет запрос к базе данных для получения информации об активных уведомлениях.

*Выходные данные:* -

### getOneWithRelations

*Входные данные:*

- Идентификатор уведомления:

```json
{
  id: string;
}
```

*Функционал:*

Находит в базе данных уведомление с указанным ID и возвращает объект вместе с его отношениями `groups`, `roles`, `userTariffs`. Если уведомление не найдено, возвращает пустой ответ.

*Выходные данные:*

Возвращает объект Popup с информацией об уведомлении и дополнительными параметрами.

```json
{
  id: string;
  createdAt: Date;
  title: string;
  text: string;
  roles: Role[];
  groups: Group[];
  userTariffs: UserTariff[];
  withoutGroup: boolean;
  withoutUserTariff: boolean;
  interval: number;
  status: PopupStatus('ACTIVE', 'INACTIVE');
  dateStart: Date;
  views: PopupView[];
}
```

Role:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  code: string;
  fields?: Record<string, unknown>[] | null;
  fieldsView?: Record<string, unknown> | null;
  isPlatformAdmin: boolean;
  sortIndex?: number | null;
  isDefault: boolean;
}
```

Group:

```json
{
  id: string;
  createdAt: Date;
  letter: string;
  classNumber: number;
}
```

UserTariff:

```json
{
  id: string;
  createdAt: Date;
  monthPeriod: number;
  name: string;
  price: number;
  isReferral: boolean;
}
```

PopupView:

```json
{
  popupId: string;
  userId: string;
  doNotShowAgain: boolean;
}
```

### getById

*Входные данные:*

- Идентификатор уведомления:

```json
{
  id: string;
}
```

*Функционал:*

Находит в базе данных уведомление с указанным ID. Если уведомление не найдено, возвращает пустой ответ.

*Выходные данные:*

Возвращает объект Popup с информацией об уведомлении.

```json
{
  id: string;
  createdAt: Date;
  title: string;
  text: string;
  withoutGroup: boolean;
  withoutUserTariff: boolean;
  interval: number;
  status: PopupStatus('ACTIVE', 'INACTIVE');
  dateStart: Date;
  views: PopupView[];
}
```

PopupView:

```json
{
  popupId: string;
  userId: string;
  doNotShowAgain: boolean;
}
```

### create

*Входные данные:*

- Методу должны быть переданы параметры CreatePopupParams:

```json
{
  title: string;
  text: string;
  status: PopupStatus;
  interval: number;
  roles: Role[];
  groups?: Group[];
  userTariffs?: UserTariff[];
  withoutGroup?: boolean;
  withoutTariff?: boolean;
}
```

*Функционал:*

Создает в базе данных уведомление, в соответствии с переданными параметрами. Устанавливает время начала показа уведомления `dateStart` на дату и время, которое соответствует началу следующего часа.

*Выходные данные:*

Возвращает объект Popup с информацией об уведомлении.

```json
{
  id: string;
  createdAt: Date;
  title: string;
  text: string;
  withoutGroup: boolean;
  withoutUserTariff: boolean;
  interval: number;
  status: PopupStatus('ACTIVE', 'INACTIVE');
  dateStart: Date;
  views: PopupView[];
}
```

PopupView:

```json
{
  popupId: string;
  userId: string;
  doNotShowAgain: boolean;
}
```

### update

*Входные данные:*

- Данные уведомления (Popup), соответствуют выходным данным:
- Данные для обновления уведомления (UpdatePopupParams):

```json
{
  title?: string;
  text?: string;
  interval?: number;
  status?: PopupStatus('ACTIVE', 'INACTIVE');
  roles?: Role[];
  groups?: Group[];
  userTariffs?: UserTariff[];
  withoutGroup?: boolean;
  withoutTariff?: boolean;
}
```

*Функционал:*

Обновляет информацию об уведомлении в базе данных, в соответствии с переданными параметрами.

*Выходные данные:*

Возвращает объект Popup с информацией об уведомлении

```json
{
  id: string;
  createdAt: Date;
  title: string;
  text: string;
  withoutGroup: boolean;
  withoutUserTariff: boolean;
  interval: number;
  status: PopupStatus('ACTIVE', 'INACTIVE');
  dateStart: Date;
  views: PopupView[];
}
```

PopupView:

```json
{
  popupId: string;
  userId: string;
  doNotShowAgain: boolean;
}
```

### read

*Входные данные:*

- Идентификаторы уведомления и пользователя

```json
{
  popupId: string
  userId: string
}
```

*Функционал:*

Записывает в базу данных, в сущность `PopupView` данные, переданные в запросе. Если данные уже присутствуют, пропускает действие.

*Выходные данные:* -

### doNotShow

*Входные данные:*

- Идентификаторы уведомления и пользователя

```json
{
  popupId: string
  userId: string
}
```

*Функционал:*

Меняет значение параметра `doNotShowAgain` на `true` для уведомления с переданным идентификатором, для указанного пользователя.

*Выходные данные:* -

### delete

*Входные данные:*

- Идентификатор уведомления

```json
{
  popupId: string
  userId: string
}
```

*Функционал:*

Выполняет `softDelete` удаление уведомления из базы данных.

*Выходные данные:* -

***

## Зависимости (импортируемые модули)

- TypeOrmModule

***

## Используемый стэк

- JavaScript
- NestJS
- TypeScript
- Node.js