---
date: 2024-10-25
tags:
  - Онлайн-школа
---
# UploadModule

Модуль предназначен для загрузки и управления файлами.

## UploadController

В контроллере применяются следующие проверки

- ThrottlerGuard - ограничивает количество запросов от пользователя
- JWTGuard - проверят на валидность токен для доступа к методам

***

### Endpoints

Контроллер предоставляет следующие эндпоинты:

| Метод  | URL                  | Описание                                 |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `upload/`            | Загрузка файла                           |
| POST   | `upload/resize`      | Загрузить изображение с масштабированием |
| GET    | `upload`             | Получить список загруженных файлов       |
| GET    | `upload/:id`         | Получить загруженный файл по ID          |
| DELETE | `upload/:id`         | Удалить загруженный файл                 |
| POST   | `upload/add-upload`  | Прикрепить загруженный файл пользователю |
| POST   | `upload/init-upload` | Инициализация загрузки в Kinescope       |

***

### Загрузка файла

`POST upload/`

*Входные данные:*

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

- Загружаемый файл (Multer):

```json
{
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
```

*Функционал:*

Если в запросе не был указан загружаемый файл, выбрасывается исключение BadRequestException с сообщение об ошибке "Файл не выбран".

Метод создает уникальное имя файла используя случайносгенерированный хэш, добавляемый к оригинальному имени файла. Выполняется проверка, что имя файла соответствует требованиям для сохранения в хранилище S3, если нет, оно преобразуется при помощи `encodeURI`.

Файл загружается в S3, после чего извлекается его ключ, определяется тип файла и создается соответствующая запись в базе данных. Если загруженный файл является видео файлом, дополнительно создается изображение миниатюры.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о загруженном файле (Upload).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

### Загрузить изображение с масштабированием

`POST upload/resize`

*Входные данные:*

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

- Загружаемый файл (Multer):

```json
{
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
```

*Функционал:*

Предварительно в методе выполняются следующие проверки: файл является изображением, размер изображения больше чем 200 x 200 пикселей. Изменяет разрешение изображения до 200 x 200 пикселей и вызывает метод `add` для загрузки изображения.

Метод создает уникальное имя файла используя случайносгенерированный хэш, добавляемый к оригинальному имени файла. Выполняется проверка, что имя файла соответствует требованиям для сохранения в хранилище S3, если нет, оно преобразуется при помощи `encodeURI`.

Файл загружается в S3, после чего извлекается его ключ, определяется тип файла и создается соответствующая запись в базе данных. Если загруженный файл является видео файлом, дополнительно создается изображение миниатюры.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о загруженном изображении (Upload).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

### Получить список загруженных файлов

`GET upload`

*Входные данные:*

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

-  Query параметры (UploadFindOptionsDto):

```json
{
 page? = 1;
 limit? = 15;
 sortBy? = 'id';
 sortDesc?: 'ASC' | 'DESC' = 'DESC';
}
```

*Функционал:*

Выполняет запрос к базе данных для получения списка загруженных файлов, в соответствии с переданными параметрами.

Метод проверяет роль пользователя, и если она не соответствует роли администратора или супер администратора, возвращает только файлы текущего пользователя

*Выходные данные:* Status: `200 OK`

Возвращает массив объектов, содержащий информацию о загруженных файлах (Upload), а также информацию о пагинации и общем количестве элементов.

```json
{
  items: Upload[];
  meta: {
	totalItems: number;,
	itemCount: number;
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
  }
}
```

```json
Upload {
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

### Получить загруженный файл по ID

`GET upload/:id`

*Входные данные:*

- В URL запроса должен быть передан ID файла

*Функционал:*

Находит в базе данных информацию о файле с указанным ID. Если файл с переданным идентификатором не найден, выбрасывает исключение NotFoundException.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о загруженном файле (Upload).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

### Удалить загруженный файл

`DELETE upload/:id`

*Входные данные:*

- В URL запроса должен быть передан ID файла
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

Первоначально метод выполняет проверку наличия у пользователя роли администратора, супер администратора или редактор контента. Если пользователь имеет одну из этих ролей, вызывает `softDelete` удаление из базы данных. В случае ошибки, выводит сообщение в лог.

Если пользователь не имеет ни одну из вышеперечисленных ролей, выполняется поиск файла в базе данных. В случае если файл не найден выбрасывает исключение NotFoundException с сообщением об ошибке, если параметр `ownerId` файла не соответствует ID пользователя, выбрасывает исключение ForbiddenException с сообщением об ошибке. Если все проверки были успешно пройдены, также вызывает `softDelete` удаление из базы данных.

*Выходные данные:* Status: `200 Успешно удалено`

### Прикрепить загруженный файл пользователю

`POST upload/add-upload`

*Входные данные:*

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

- В тело запроса должны быть переданы следующие параметры (AddUploadDto):

```json
{
  name: string;
  path?: string;
  mimetype: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
}
```

*Функционал:*

Метод создает уникальный хэш для новой сущности файла, получает mimetype из переданных параметров, создает и сохраняет объект в базе данных, в соответствии с переданными параметрами, устанавливая для параметра `ownerId` ID пользователя.

*Выходные данные:* Status: `201 CREATED, Успешно создано`

Возвращает объект, содержащий информацию о прикрепленном файле (Upload).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

### Инициализация загрузки в Kinescope

`POST upload/init-upload`

*Входные данные:*

- Объект Request, содержащий важные заголовки:
	- `upload-length` - общий размер загружаемого файла
	- `upload-metadata` - метаданные о файле

*Функционал:*

Сначала метод извлекает переданные размер файла и метаданные, при отсутствии последних выбрасывает исключение BadRequestException. Декодирует строки метаданных формата Base64 и преобразует в объект, содержащий пары ключ-значение (ключи — строки из метаданных, значения — декодированные в UTF-8 данные).

Выполняет POST-запрос к API Kinescope для инициализации загрузки, передает подготовленные данные. В случае ошибки, выводит сообщение в лог и выбрасывает исключение InternalServerErrorException.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о загруженном файле и URL в Kinescope.

## RestrictedUploadController

В контроллере применяются следующие проверки

- ThrottlerGuard - ограничивает количество запросов от пользователя
- JWTGuard - проверят на валидность токен для доступа к методам

***

### Endpoints

Контроллер предоставляет следующий эндпоинт:

| Метод | URL                  | Описание                                 |
| ----- | -------------------- | ---------------------------------------- |
| POST  | `restricted-upload/` | Загрузка файла с ограничением по размеру |

***

### Загрузка файла с ограничением по размеру

`POST restricted-upload/`

*Входные данные:*

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

- Загружаемый файл (Multer):

```json
{
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
```

*Функционал:*

Метод проверяет что размер загружаемого файла не превышает 1 Гб (`MAX_FILE_UPLOAD_BYTES_SIZE`), затем вызывает метод `add`.

Если в запросе не был указан загружаемый файл, выбрасывается исключение BadRequestException с сообщение об ошибке "Файл не выбран".

Метод создает уникальное имя файла используя случайносгенерированный хэш, добавляемый к оригинальному имени файла. Выполняется проверка, что имя файла соответствует требованиям для сохранения в хранилище S3, если нет, оно преобразуется при помощи `encodeURI`.

Файл загружается в S3, после чего извлекается его ключ, определяется тип файла и создается соответствующая запись в базе данных. Если загруженный файл является видео файлом, дополнительно создается изображение миниатюры.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о загруженном файле (Upload).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  path?: string;
  mimetype: string;
  type: UploadType('VIDEO', 'IMAGE', 'AUDIO', 'PDF', 'DOCUMENT');
  hash: string;
  thumbnailUrl?: string | null;
  size: number;
  kinescopeId?: string | null;
  blurPath?: string | null;
}
```

***

## Зависимости (импортируемые модули)

- TypeOrmModule
- ConfigModule,
- FfmpegModule,
- HttpModule
- ImgproxyModule

***

## Используемый стэк

- JavaScript
- NestJS
- TypeScript
- Node.js