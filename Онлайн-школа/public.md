---
date: 2024-02-15
tags:
  - Онлайн-школа
---
# PublicModule

Модуль предназначен для работы с избранными уроками пользователя, личными данными, отзывами, получения информации о SEO записях, тестах, предметах и разделах, регистрации обучающихся.

Состоит из следующих контроллеров:

1. [AuthPublicController](#AuthPublicController)
2. [PublicController](#PublicController)

## AuthPublicController

В контроллере применяются следующие проверки

- ThrottlerGuard - ограничивает количество запросов от пользователя
- JWTGuard - проверят на валидность токен для доступа к методам

***

### Endpoints

Контроллер предоставляет следующие эндпоинты:

| Метод  | URL                                    | Описание                                                             |
| ------ | -------------------------------------- | -------------------------------------------------------------------- |
| GET    | `auth-public/featured/`                | Получить избранные уроки                                             |
| GET    | `auth-public/profile/me/`              | Получить данные профиля текущего пользователя                        |
| POST   | `auth-public/featured/:lesson/`        | Добавить урок в избранное                                            |
| PATCH  | `auth-public/profile/`                 | Редактировать профиль пользователя                                   |
| DELETE | `auth-public/featured/:lesson/`        | Удалить урок из избранного                                           |
| POST   | `auth-public/review/`                  | Добавить отзыв                                                       |
| GET    | `auth-public/review/`                  | Получить опубликованные отзывы с учетом лайков текущего пользователя |
| POST   | `auth-public/review/:reviewId/rating/` | Обновить рейтинг отзыва                                              |

***

### Получить избранные уроки

`GET auth-public/featured/`

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

- Query параметры (GetFeaturedDto) с учетом пагинации:

```json
{
  limit?: number;
  offset?: number;
  subjectSlug?: string;
}
```

*Функционал:*

Отправляет запрос к базе данных для получения избранных уроков пользователя в соответствии с данными, переданными в запросе.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий массив данных об избранных уроках (Lesson) пользователя, а также количество объектов в массиве.

```json
{
  results: Lesson[];
  count: number;
}
```

Lesson:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  programId: string;
  program: Program;
  quarter: LessonQuarterType('FIRST', 'SECOND', 'THIRD', 'FOURTH',) | null;
  logoId?: string | null;
  sectionId?: string | null;
  section?: LessonSection | null;
  sortIndex?: number | null;
  publicAccess: boolean;
  slug?: string | null;
  demoAccess: boolean;
  description: string;
  publicVideos: boolean;
  teacherCode?: string | null;
  capacity: number;
}
```

Program:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  publicName?: string | null;
  description?: string | null;
  classNumber?: number | null;
  course: ProgramCourse('MAIN', 'ADDITIONAL', 'EXAM');
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
  subjectId?: string | null;
  subject?: Subject | null;
  autoNumberingLessons: boolean;
  catalogId?: string | null;
  logoId?: string | null;
  slug?: string | null;
  allowEvaluating: boolean;
  demoAccess: boolean;
  demoAccessPreschooler: boolean;
  icon: ProgramIcon('pi', 'palace', 'molecule', 'globe', 'compass', 'monitor', 'theater', 'feather', 'cap', 'book', 'brain', 'atom', 'formula') | null;
}
```

Subject:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  slug?: string | null;
}
```

LessonSection:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  subjectId?: string | null;
}
```

### Получить данные профиля текущего пользователя

`GEt auth-public/profile/me/`

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

*Функционал:*

Выполняет поиск в базе данных текущего пользователя по идентификатору и возвращает информацию о нем. В случае, если ID пользователя из запроса не был найден выбрасывает исключение NotFoundException с сообщением об ошибке "Профиль не найден".

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о профиле пользователя (User).

```json
{
  id: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  phone?: string | null;
  status: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  isSuperAdmin: boolean;
  email?: string | null;
  lastSignIn?: Date | null;
  fields?: Record<string, unknown> | null;
  avatarId?: string | null;
  avatar?: Upload | null;
  roleId: string;
  groupId: string | null;
  subgroupId?: string | null;
  attestationGroupId?: string | null;
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

### Добавить урок в избранное

`POST auth-public/featured/:lesson/`

*Входные данные:*

- В URL запроса должен быть передан UUID урока (`lesson: string`)
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

Выполняется проверка не находится ли урок с переданным ID уже в избранном текущего пользователя. Если да, выбрасывается исключение BadRequestException с сообщением об ошибке "Урок уже находится в избранном". После проверяется существование урока с данным ID в базе данных. Если урок не найден, выбрасывается исключение BadRequestException с сообщением об ошибке "Урок не найден".

Метод обновляет список пользователей, связанных с уроком, добавляя текущего пользователя в массив и сохраняет обновленный объект в базе данных.

*Выходные данные:* Status: `200 OK`, StatusMessage: `Успешно обновлено`

Возвращает объект с обновленной информацией об уроке (Lesson).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  programId: string;
  program: Program;
  quarter: LessonQuarterType('FIRST', 'SECOND', 'THIRD', 'FOURTH',) | null;
  users: User[];
  logoId?: string | null;
  sectionId?: string | null;
  section?: LessonSection | null;
  sortIndex?: number | null;
  publicAccess: boolean;
  slug?: string | null;
  demoAccess: boolean;
  description: string;
  publicVideos: boolean;
  teacherCode?: string | null;
  capacity: number;
}
```

### Редактировать профиль пользователя

`PATCH auth-public/profile/`

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

- В тело запроса должны быть переданы следующие параметры (UpdateUserProfileDto):

```json
{
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  email?: string;
  password?: string;
  fields?: Record<string, unknown>;
  avatarId?: string;
  groupId?: string;
  status?: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  attestationGroupId?: string;
  programs?: string[];
}
```

*Функционал:*

Выполняет поиск в базе данных текущего пользователя, проверяет на конфликты состав классов, для обновляемого пользователя, с учетом данных, переданных в запросе. В соответствии с переданными данными, обновляет информацию о пользователе и его связи, при необходимости удаляет старые связи.

*Выходные данные:* Status: `200 OK`, StatusMessage: `Успешно обновлено`

Возвращает объект, содержащий обновленную информацию о пользователе (User).

```json
{
  id: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  phone?: string | null;
  status: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  isSuperAdmin: boolean;
  email?: string | null;
  lastSignIn?: Date | null;
  fields?: Record<string, unknown> | null;
  avatarId?: string | null;
  avatar?: Upload | null;
  roleId: string;
  groupId: string | null;
  subgroupId?: string | null;
  attestationGroupId?: string | null;
}
```

### Удалить урок из избранного

`DELETE auth-public/featured/:lesson/`

*Входные данные:*

- В URL запроса должен быть передан UUID урока (`lesson: string`)
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

Выполняется проверка существует ли урок с переданным ID, связанный с текущим пользователем. Если нет, выбрасывается исключение BadRequestException с сообщением об ошибке "Урок не найден".

Метод обновляет список пользователей, связанных с уроком, удаляя текущего пользователя и сохраняет обновленный объект в базе данных.

*Выходные данные:* -, Status: `200 OK`, StatusMessage: `Успешно обновлено`

### Добавить отзыв

`POST auth-public/review/`

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

- В тело запроса должны быть переданы следующие параметры (CreateReviewDto):

```json
{
  lessonId: string;
  text: string;
  grade: number;
}
```

*Функционал:*

Создает новый отзыв в базе данных, связывая его с ID текущего пользователя и ID урока, в соответствии с переданными параметрами.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект, содержащий информацию о созданном отзыве (Review).

```json
{
  id: string;
  createdAt: Date;
  userId: string | null;
  user: User | null;
  lessonId?: string | null;
  lesson: Lesson;
  text: string;
  status: ReviewStatus('NOT_MODERATED', 'MODERATED', 'PUBLISHED');
  grade: number;
  rating: ReviewRating[];
}
```

### Получить опубликованные отзывы с учетом лайков текущего пользователя

`GET auth-public/review/`

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

- Query параметры (GetReviewsDto) с учетом пагинации:

```json
{
  limit?: number;
  offset?: number;
  isNotModerated?: boolean;
  lessonId?: string;
}
```

*Функционал:*

Метод создает запрос к базе данных для получения всех рецензий со статусом `PUBLISHED`, в соответствии с переданным запросом. Выполняет подсчет рейтинга: если параметр `isLiked.reviewRating` равен `true`, увеличивает `ratingCount` на 1, в противном случае уменьшает на 1. Если ID пользователя для отзыва совпадает с ID из UserPayload, устанавливает значение `true` для переменной `isLikedByUser`.

*Выходные данные:* Status: `200 OK`

Возвращает объекты (ReviewWithRating), содержащие информацию об отзывах и информацию о том, лайкнул ли текущий пользователь отзыв.

```json
{
  id: string;
  createdAt: Date;
  serId: string | null;
  user: User | null;
  lessonId?: string | null;
  lesson: Lesson;
  text: string;
  status: ReviewStatus('NOT_MODERATED', 'MODERATED', 'PUBLISHED');
  grade: number;
  rating: ReviewRating[];
  ratingCount: number;
  isLikedByUser: boolean | null;
}
```

ReviewRating:

```json
{
  userId: string;
  reviewId: string;
  isLiked: boolean;
}
```

### Обновить рейтинг отзыва

`POST auth-public/review/:reviewId/rating/`

*Входные данные:*

- В URL запроса должен быть передан UUID отзыва (`reviewId: string`)
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

- В тело запроса должны быть переданы следующие параметры (CreateReviewRatingDto):

```json
{
  isLiked: boolean;
}
```

*Функционал:*

Создает в базе данных новый объект рейтинга для отзыва с переданным ID и связывает его с текущим пользователем.

*Выходные данные:* Status: `201 CREATED`

Возвращает объект с информацией о рейтинге отзыва (ReviewRating).

```json
{
  userId: string;
  reviewId: string;
  isLiked: boolean;
}
```

## PublicController

В контроллере применяются следующие проверки

- ThrottlerGuard - ограничивает количество запросов от пользователя

***

### Endpoints

Контроллер предоставляет следующие эндпоинты:

| Метод | URL                                    | Описание                                         |
| ----- | -------------------------------------- | ------------------------------------------------ |
| GET   | `public/seo`                           | Получить SEO запись по URL                       |
| GET   | `public/test-of-day`                   | Получить тест дня                                |
| GET   | `public/version-app`                   | Получить последнюю версию приложения             |
| GET   | `public/banners`                       | Получить баннеры                                 |
| GET   | `public/class-numbers`                 | Получить все номера классов                      |
| GET   | `public/subjects`                      | Получить все предметы                            |
| GET   | `public/lesson-popular`                | Получить популярные уроки                        |
| GET   | `public/search`                        | Полнотекстовый поиск уроков                      |
| GET   | `public/review`                        | Получить опубликованные отзывы                   |
| GET   | `public/review/:reviewId`              | Получить отзыв по ID                             |
| GET   | `public/:classNumber`                  | Получить разделы для класса                      |
| GET   | `public/:classNumber/:subject`         | Получить разделы для предмета класса             |
| GET   | `public/:classNumber/:subject/:lesson` | Получить урок с информацией об отзывах и учителе |
| POST  | `public/create-referral`               | Создание реферального пользователя               |

***

### Получить SEO запись по URL

`GET public/seo`

*Входные данные:*

- Query параметры:

```json
{
  url: string;
}
```

*Функционал:*

Проверяет наличие редиректов, если нет, создает новые записи редиректов из массива `redirectUrlPairs`. Если записи существуют, проверяет на наличие битых ссылок, и в случае нахождения возвращает объект с новым URL.

Метод получает описание раздела по URL, ищет SEO-запись в базе данных или кэше Redis. Если запись найдена, возвращает объект с добавлением информации о разделе.

Разбивает URL на части, и в зависимости от количества частей формирует  шаблон записи с заголовком и описанием. Выполняет запрос к базе данных для получения связанных сущностей (программ, уроков, предметов), возвращает объект SEO записи.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о SEO записи (MetaParamsInterface).

```json
{
  title: string;
  description: string;
  canonical: string;
  template: boolean;
  redirectUrl?: string;
  textForSection: SectionDescription | null;
}
```

### Получить тест дня

`GET public/test-of-day`

*Входные данные:* -

*Функционал:*

Получает теста дня из базы данных. Проверяет что для класса, предмета и урока задан Slug, в противном случае выбрасывает исключение NotFoundException с сообщением об ошибке "Тест не найден".

*Выходные данные:* Status: `200 OK`

Возвращает объект (GetTestOfDayInterface)

```json
{
  id?: string;
  createdAt?: Date;
  subTitle?: string | null;
  description?: string | null;
  type?: TestType('TRAINING', 'CONTROL', 'FINAL', 'EXAM_5', 'EXAM_100');
  logoId?: string | null;
  logo?: Upload | null;
  material?: Material;
  questionGroups?: TestQuestionGroup[];
  settings?: TestSettingsDto;
  testOfDay?: boolean;
  info?: string | null;
  classSlug: string | null;
  subjectSlug: string | null;
  lessonSlug: string | null;
}
```

### Получить последнюю версию приложения

`GET public/version-app`

*Входные данные:* -

*Функционал:*

Извлекает информацию о текущей версии приложения из базы данных. В случае, если запрос к базе данных завершился ошибкой, выбрасывает исключение BadRequestException. Если версия приложения не найдена, выбрасывает исключение NotFoundException с сообщением об ошибке "Версия не найдена".

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией о версии приложения (VersionApp).

```json
{
  id: number;
  timestamp: Date;
  version: string;
}
```

### Получить баннеры

`GET public/banners`

*Входные данные:*

- Query параметры пагинации (PaginationDto):

```json
{
  limit?: number;
  offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения информации о баннерах с учетом параметров пагинации, переданных в запросе.

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией о баннерах (Banner), а также общее количество результатов.

```json
{
  results: Banner[];
  count: number;
}
```

Banner:

```json
{
  id?: string;
  createdAt?: Date;
  url: string;
  image: Upload;
  imageId: string;
}
```

### Получить все номера классов

`GET public/class-numbers`

*Входные данные:*

- Query параметры пагинации (PaginationDto):

```json
{
  limit?: number;
  offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения всех номеров классов, с учетом пагинации.

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией о номерах классов (ClassNumber) с сотировкой по возрастанию, а также общее количество результатов.

```json
{
  results: ClassNumber[];
  count: number;
}
```

ClassNumber:

```json
{
  id: number;
  slug: string;
}
```

### Получить все предметы

`GET public/subjects`

*Входные данные:*

- Query параметры пагинации (PaginationDto):

```json
{
  limit?: number;
  offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения всех предметов, с учетом пагинации. Для каждого предмета, выполняется поиск номеров классов в программах обучения.

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией о предметах (SubjectWithClasses) и классах, а также общее количество результатов.

```json
{
  results: SubjectWithClasses[];
  count: number;
}
```

SubjectWithClasses:

```json
{
  id?: string;
  createdAt?: Date;
  name: string;
  slug?: string | null;
  classes: number[];
}
```

### Получить популярные уроки

`GET public/lesson-popular`

*Входные данные:* -

*Функционал:*

Выполняет запрос к базе данных для получения всех уроков, у которых параметр `publicAccess` равен `true` и `visitCount` не равен нулю.

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией об уроках (Lesson) отсортированных в порядке уменьшения по `visitCount`, а также общее количество результатов.

```json
{
  results: Lesson[];
  count: number;
}
```

Lesson:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  programId: string;
  program: Program;
  logoId?: string | null;
  sectionId?: string | null;
  section?: LessonSection | null;
  sortIndex?: number | null;
  publicAccess: boolean;
  slug?: string | null;
  demoAccess: boolean;
  description: string;
  publicVideos: boolean;
  teacherCode?: string | null;
}
```

### Полнотекстовый поиск уроков

`GET public/search`

*Входные данные:*

- Query параметры (GetSearchLessonDto) с учетом пагинации:

```json
{
  limit?: number;
  offset?: number;
  subjectId?: string;
  class?: number;
  search: string;
}
```

*Функционал:*

Отправляет запрос к базе данных для выполнения полнотекстового поиска по урокам в соответствии с данными, переданными в запросе. Метод использует Elasticsearch для поиска по полям `name` и `text`.

*Выходные данные:* Status: `200 OK`

Возвращает объект с результатами поиска (GetSearchPublicResultInterface), включая общее количество найденных уроков.

```json
{
  results: GetSearchPublicResultInterface[];
  count: number;
}
```

GetSearchPublicResultInterface:

```json
{
  id: string;
  subject: string;
  class?: number | null;
  name: string;
  text: string;
  subjectId: string | null;
  lessonSlug: string | null;
  subjectSlug: string | null;
  classSlug: string | null;
}
```

### Получить опубликованные отзывы

`GET public/review`

*Входные данные:*

- Query параметры (GetSearchLessonDto) с учетом пагинации:

```json
{
  limit?: number;
  offset?: number;
  isNotModerated?: boolean;
  lessonId?: string;
}
```

*Функционал:*

Метод создает запрос к базе данных для получения всех рецензий со статусом `PUBLISHED`, в соответствии с переданным запросом. Выполняет подсчет рейтинга: если параметр `isLiked.reviewRating` равен `true`, увеличивает `ratingCount` на 1, в противном случае уменьшает на 1.

Функционал метода совпадает с методом [Получить опубликованные отзывы с учетом лайков текущего пользователя](#Получить опубликованные отзывы с учетом лайков текущего пользователя), но поле `isLikedByUser` будет равно `null` для всех отзывов.

*Выходные данные:* Status: `200 OK`

Возвращает объекты (ReviewWithRating), содержащие информацию об отзывах.

```json
{
  id: string;
  createdAt: Date;
  serId: string | null;
  user: User | null;
  lessonId?: string | null;
  lesson: Lesson;
  text: string;
  status: ReviewStatus('NOT_MODERATED', 'MODERATED', 'PUBLISHED');
  grade: number;
  rating: ReviewRating[];
  ratingCount: number;
  isLikedByUser: boolean | null;
}
```

ReviewRating:

```json
{
  userId: string;
  reviewId: string;
  isLiked: boolean;
}
```

### Получить отзыв по ID

`GET public/review/:reviewId`

*Входные данные:*

- В URL запроса должен быть передан UUID отзыва (`reviewId: string`)

*Функционал:*

Отправляет запрос к базе данных для получения отзыва с указанным ID. В случае, если отзыв не найден выбрасывает исключение NotFoundException с сообщением об ошибке "Отзыв не найден".

*Выходные данные:* Status: `200 OK`

Возвращает объект с информацией об отзыве (Review).

```json
{
  id: string;
  createdAt: Date;
  serId: string | null;
  user: User | null;
  lessonId?: string | null;
  lesson: Lesson;
  text: string;
  status: ReviewStatus('NOT_MODERATED', 'MODERATED', 'PUBLISHED');
  grade: number;
  rating: ReviewRating[];
}
```

ReviewRating:

```json
{
  userId: string;
  reviewId: string;
  isLiked: boolean;
}
```

### Получить разделы для класса

`GET public/:classNumber`

*Входные данные:*

- В URL запроса должен быть передан Slug класса (`classNumber: string`)
- Query параметры о пагинации (PaginationDto):

```json
{
 limit?: number;
 offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения разделов указанного класса. В случае, если `classNumber` равен `all-classes`, метод возвращает все доступные разделы. Если для разделов загружены видео, выбирает 10 из них случайным образом.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о разделах и видео для них (GetSectionsDataInterface).

```json
{
  data: {
    results: PublicSubject[];
    videoForSection: MaterialWithSlug[]
  };
}
```

PublicSubject:

```json
{
  sections: PublicSection[];
  withoutSection: PublicLesson[];
}
```

PublicSection:

```json
{
  id: string;
  name: string;
  subject?: Subject | null;
  classes: PublicClassNumber[];
}
```

PublicClassNumber:

```json
{
  class?: number;
  lessons: PublicLesson[];
}
```

PublicLesson:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  slug?: string | null;
}
```

MaterialWithSlug:

```json
{
  id: string;
  createdAt: Date;
  name: string;
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
  subTitle?: string | null;
  description?: string | null;
  catalogId?: string | null;
  uploadId?: string | null;
  upload?: Upload | null;
  testId?: string | null;
  textbookId?: string | null;
  textbook?: Textbook | null;
  link?: string | null;
  previewUrl?: string | null;
  userId?: string | null;
  taskId?: string | null;
  isInvisible: boolean;
  classSlug?: string;
  subjectSlug?: string | null;
  lessonSlug?: string | null;
}
```

### Получить разделы для предмета класса

`GET public/:classNumber/:subject`

*Входные данные:*

- В URL запроса должен быть передан Slug класса (`classNumber: string`) и Slug предмета (`subject: string`)
- Query параметры о пагинации (PaginationDto):

```json
{
 limit?: number;
 offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения разделов указанного предмета и класса. В случае, если `classNumber` равен `all-classes`, метод возвращает все доступные разделы указанного предмета. Если для разделов загружены видео, выбирает 10 из них случайным образом.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о разделах и видео для них (GetSectionsDataInterface). Соответствует выводу [Получить разделы для класса](#Получить разделы для класса)

```json
{
  data: {
    results: PublicSubject[];
    videoForSection: MaterialWithSlug[]
  };
}
```

### Получить урок с информацией об отзывах и учителе

`GET public/:classNumber/:subject/:lesson`

Входные данные:

- В URL запроса должен быть передан Slug класса (`classNumber: string`), Slug предмета (`subject: string`), 
- Query параметры о пагинации (PaginationDto):

```json
{
 limit?: number;
 offset?: number;
}
```

*Функционал:*

Выполняет запрос к базе данных для получения случайного урока, указанного в запросе, и если у него присутствует `teacherCode`, выполняет GET запрос `/detail/${lesson.teacherCode}` для получения данных о преподавателе.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию об уроке и его отзывах, учителе, если он был найден, и случайном уроке (GetLessonWithRandomLessonsInterface).

```json
{
  data: LessonWithReviews | undefined;
  teacher: TeachersResponse | null;
  randomLessons: Lesson[];
}
```

TeachersResponse:

```json
{
  fio: string;
  position: string;
  code: string;
  img: { url: string };
  fields: { id: number; code: string; value: string }[];
  announce: string;
}
```

### Создание реферального пользователя

`POST public/create-referral`

*Входные данные:*

- Проверки ReferralGuard, RegistrationGuard
- В тело запроса должны быть переданы следующие параметры (ReferralRegistrationDto):

```json
{
  phone?: string;
  email?: string;
  firstName: string;
  lastName: string;
  userRole?: 'student' | 'preschooler';
}
```

*Функционал:*

Создает в базе данных нового пользователя с ролью `student`, случайно сгенерированным паролем и данными, переданными в запросе. В запросе обязательно должны быть переданы `phone` или `email`. Если был указан адрес электронной почты, отправляет на него письмо с данными для входа, в противном случае отправляет СМС.

*Выходные данные:* Status: `200 OK`

Возвращает объект, содержащий информацию о созданном пользователе (User).

```json
{
  id: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  phone?: string | null;
  status: UserStatus('INACTIVE', 'ACTIVE', 'BLOCKED');
  isSuperAdmin: boolean;
  email?: string | null;
  lastSignIn?: Date | null;
  fields?: Record<string, unknown> | null;
  avatarId?: string | null;
  avatar?: Upload | null;
  roleId: string;
  groupId: string | null;
  subgroupId?: string | null;
  attestationGroupId?: string | null;
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

## Зависимости (импортируемые модули)

- HttpModule
- TypeOrmModule
- ClassNumberModule
- SubjectModule
- UserModule
- ShortcodeModule
- BannerModule
- TestModule
- VersionModule
- ReviewModule
- SearchModule
- RoleModule
- AuthModule
- TextbookModule

***

## Используемый стэк

- JavaScript
- NestJS
- TypeScript
- Node.js