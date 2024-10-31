---
date: 2024-10-30
tags:
  - Онлайн-школа
---
# BannerModule

Модуль предназначен для работы с баннерами.

***

## BannerService

Предоставляет следующие методы:

| Имя     | Описание              |
| ------- | --------------------- |
| get     | Получить баннеры      |
| getById | Получить баннер по ID |
| create  | Создать баннер        |
| update  | Обновить баннер       |
| delete  | Удалить баннер        |

***

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

Выполняет запрос к базе данных для получения баннеров и их изображений с учетом пагинации.

*Выходные данные:*

Возвращает объект с массивом баннеров (Banner) и их общим количеством с учетом пагинации.

```json
{
  results: Banner[];
  count: number;
}
```

```json
Banner {
  id: string;
  createdAt: Date;
  url: string;
  image: Upload;
  imageId: string;
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

### getById

*Входные данные:*

```json
{
  id: string
}
```

*Функционал:*

Выполняет запрос к базе данных для получения баннера с переданным идентификатором. Если баннер не найден выбрасывет исключение NotFoundException с сообщением об ошибке "Баннер не найден".

*Выходные данные:*

Возвращает объект с информацией о баннере.

```json
Banner {
  id: string;
  createdAt: Date;
  url: string;
  image: Upload;
  imageId: string;
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

### create

*Входные данные:*

```json
{
  data: CreateBannerDto {
    url: string;
    imageId: string;
  };
}
```

*Функционал:*

Создает и сохраняет в базе данных новый экземпляр баннера, в соответствии с переданными параметрами.

*Выходные данные:*

Возвращает объект, с информацией о созданном баннере.

```json
Banner {
  id: string;
  createdAt: Date;
  url: string;
  image: Upload;
  imageId: string;
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

### update

*Входные данные:*

```json
{
  id: string;
  data: UpdateBannerDto {
    url?: string;
    imageId?: string;
  };
}
```

*Функционал:*

Выполняет запрос к базе данных для обновления информации о баннере с переданным ID.

*Выходные данные:* -

### delete

*Входные данные:*

```json
{
  id: string;
}
```

*Функционал:*

Выполняет запрос к базе данных для удаления баннера с переданным ID.

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