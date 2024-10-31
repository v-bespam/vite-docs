---
date: 2024-10-29
tags:
  - Онлайн-школа
---
# AttestationGroupModule

Модуль предназначен для работы с аттестационными группами и их документами.

***

## AttestationGroupDocumentService

Предоставляет следующие методы:

| Имя                     | Описание                                             |
| ----------------------- | ---------------------------------------------------- |
| getByAttestationGroupId | Получить файлы аттестационной группы                 |
| add                     | Прикрепить файл к аттестационной группе              |
| delete                  | Удалить файл аттестационной группы                   |
| getByUserId             | Получить файл аттестационной группы пользователя(ей) |

***

### getByAttestationGroupId

*Входные данные:*

```json
{
  attestationGroupId: string
}
```

*Функционал:*

Выполняет поиск загруженных файлов в базе дынных, в соответствии с переданным ID аттестационной группы.

*Выходные данные:*

Возвращает массив объектов, содержащий информацию о прикрепленных файлах аттестационной группы (AttestationGroupDocument):

```json
{
  id: string;
  attestationGroupId: string;
  uploadId: string;
  upload: Upload;
}
```

Upload:

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

### add

*Входные данные:*

```json
{
  attestationGroupId: string;
  dto: AddAttestationGroupDocumentDto {
    uploadId: string;
  };
}
```

*Функционал:*

Сохраняет в базе данных переданный идентификатор загруженного файла для указанной аттестационной группы.

*Выходные данные:* -

### delete

*Входные данные:*

```json
{
  documentId: string;
  attestationGroupId: string;
}
```

*Функционал:*

Выполняет поиск в базе данных документа аттестационной группы, в соответствии с переданными идентификаторами. Если документ не найден, выбрасывается исключение NotFoundException. Удаляет документ аттестационной группы и связанный файл из базы данных.

*Выходные данные:* -

### getByUserId

*Входные данные:*

```json
{
  userId: string | string[]
}
```

*Функционал:*

Выполняет поиск в базе данных документов аттестационных групп, связанных с указанным пользователем или пользователями. Если `userId` пуст, возвращает пустой массив без выполнения запроса к базе данных.

*Выходные данные:*

Возвращает массив объектов, содержащий информацию о прикрепленных файлах аттестационной группы, соответствующий указанным пользователям (AttestationGroupDocument):

```json
{
  id: string;
  attestationGroupId: string;
  uploadId: string;
  upload: Upload;
}
```

Upload:

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

## AttestationGroupService

Предоставляет следующие методы:

| Имя        | Описание                                     |
| ---------- | -------------------------------------------- |
| getOptions | Получить аттестационные группы с параметрами |
| get        | Получить аттестационные группы               |
| getById    | Получить аттестационную группу по ID         |
| create     | Создать аттестационную группу                |
| update     | Изменить имя аттестационной группы           |
| delete     | Удалить аттестационную группу                |

***

### getOptions

*Входные данные:*

```json
{
  search?: string;
  dto?: PaginationDto {
    limit?: number;
    offset?: number;
  };
}
```

*Функционал:*

Создает запрос к базе данных для получения списка аттестационных групп. Если был передан параметр `search`, фильтрует группы по имени. Если передан объект `dto`, метод выполняет запрос с учетом пагинации.

Метод преобразует полученные группы в массив объектов, где поле `key` соответствует `id` группы, а `title` — ее имени.

*Выходные данные:*

Возвращает массив объектов с названиями аттестационных групп (FieldOption), либо, если был передан объект `dto`, объект с результатами и общим количеством найденных аттестационных групп, с учетом пагинации.

```json
FieldOption {
  key: string;
  title: string;
}
```

WithPagination:

```json
{
  results: FieldOption[];
  count: number;
}
```

### get

*Входные данные:*

```json
{
  params: PaginationDto {
    limit?: number;
    offset?: number;
  };
}
```

*Функционал:*

Выполняет запрос для получения записей об аттестационных группах из базы данных с учетом пагинации.

*Выходные данные:*

Возвращает объект с массивом аттестационных групп (AttestationGroup) и их общим количеством с учетом пагинации.

```json
{
  results: AttestationGroup[];
  count: number;
}
```

```json
AttestationGroup {
  id: string;
  createdAt: Date;
  name: string;
}
```

### getById

*Входные данные:*

```json
{
  id: string
}
```

*Функционал:*

Выполняет запрос для получения информации об аттестационной группе из базы данных в соответствии с переданным ID. Если группа не найдена, выбрасывает исключение NotFoundException с сообщением об ошибке "Аттестационная группа не найдена".

*Выходные данные:*

Возвращает объект с информацией об аттестационной группе (AttestationGroup):

```json
{
  id: string;
  createdAt: Date;
  name: string;
}
```

### create

*Входные данные:*

```json
{
  dto: CreateAttestationGroupParams {
    name: string;
  };
}
```

*Функционал:*

Создает в базе данных новую аттестационную группу, в соответствии с переданными параметрами.

*Выходные данные:*

Возвращает объект с информацией о созданной аттестационной группе (AttestationGroup):

```json
{
  id: string;
  createdAt: Date;
  name: string;
}
```

### update

*Входные данные:*

```json
{
  attestationGroup: AttestationGroup {
    id: string;
    createdAt: Date;
    name: string;
  };
  dto: UpdateAttestationGroupParams {
    name?: string;
  };
}
```

*Функционал:*

Обновляет название указанной аттестационной группы в базе данных.

*Выходные данные:*

Возвращает объект с обновленной информацией об аттестационной группе (AttestationGroup):

```json
{
  id: string;
  createdAt: Date;
  name: string;
}
```

### delete

*Входные данные:*

```json
{
  id: string
}
```

*Функционал:*

Выполняет `softDelete` удаление аттестационной группы с переданным ID из базы данных.

*Выходные данные:* -

***

## Зависимости (импортируемые модули)

- TypeOrmModule
- UploadModule

***

## Используемый стэк

- JavaScript
- NestJS
- TypeScript
- Node.js