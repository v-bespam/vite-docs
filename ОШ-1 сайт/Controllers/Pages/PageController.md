---
date: 2024-09-30
tags:
  - ОШ-1-сайт
---
Контроллер предназначен для получения информации о страницах.

### Endpoints

Контроллер предоставляет следующие эндпоинты:

| Метод | URL                               | Описание                                                                                                                                      |
| ----- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET   | `nest/api/pages/`                 | [[#Получение информации о странице\|Получение информации о странице]]                                                                         |
| GET   | `nest/api/pages/karta-sayta/`     | [[#Получение страницы Карта сайта\|Получение страницы Карта сайта]]                                                                           |
| GET   | `nest/api/pages/sitemap/`         | [[#Получение sitemap\|Получение sitemap]]                                                                                                     |
| GET   | `nest/api/pages/cosmos-data/`     | [[#Получение страницы Мобильного приложения «Онлайн‑школа. Наука в AR»\|Получение страницы Мобильного приложения «Онлайн‑школа. Наука в AR»]] |
| GET   | `nest/api/pages/biblioteka-data/` | [[#Получение страницы мобильного приложения Цифровая библиотека\|Получение страницы мобильного приложения Цифровая библиотека]]               |
| POST  | `nest/api/pages/deactivate/`      | [[#Переместить страницу в черновик\|Переместить страницу в черновик]]                                                                         |

### Получение информации о странице

`GET nest/api/pages/`

*Входные данные:*

- Query параметры:

| Параметр | Тип данных | Валидация    | Описание     |
| -------- | ---------- | ------------ | ------------ |
| code     | string     | Обязательный | Код страницы |

*Функционал:*

Выполняет поиск в кэше Redis по ключу `page:${pageCode}`, если данные не найдены, подготавливает их:

1. Выполняет запрос к Strapi для получения элемента коллекции Pages (API ID: page), с указанным кодом (URL).
2. Формирует хлебные крошки
3. Сохраняет подготовленные данные о странице в кэш

В случае если страница с указанным кодом не найдена, выбрасывает исключение с текстом "Page not found".

*Выходные данные:* Status: `200 OK`

Возвращает объект PageDto:

```json
{
  id: number;
  url: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blocks: ConstructorBlock[];
  headerMenuItems: HeaderAnchorMenuItem[];
  meta: Meta;
  breadcrumbs: BreadcrumbItem[];
  contactUsSocialLinks: SocialLinks[];
  sitemapConfig: SitemapConfig | null;
}
```

ConstructorBlock

```json
{
  __component: string;
  id: string;
  anchorCode: string;
  updated_at: string;
  [key: string]: any;
}
```

HeaderAnchorMenuItem

```json
{
  title: string;
  link: string;
}
```

Meta

```json
{
  pageName?: string;
  title?: string;
  description?: string;
  canonical?: string;
  isFaqPage?: boolean;
  excludeFromSitemap?: boolean;
  breadcrumbTitle?: string;
  sitemapTitle?: string;
}
```

 BreadcrumbItem
 
 ```json
{
  title: string;
  url: string;
}
```

SocialLinks

```json
{
  id: number;
  link: string;
  socialIcon: SocialIcon;
}
```

SitemapConfig

```json
{
  id: number;
  changefreq: string;
  priority: number;
}
```

### Получение страницы Карта сайта

`GET nest/api/pages/karta-sayta/`

*Входные данные:* отсутствуют

*Функционал:*

Выполняет поиск в кэше Redis по ключу `pages-for-karta-sayta`, если данные не найдены

1. Обращается к Strapi и получает все страницы коллекции Pages (API ID: page), c сортировкой по url в порядке увеличения
2. Получает CustomPages из pages/shared, в котором размещены в Strapi в качестве коллекций и не попадают в запрос на шаге 1, а также внешние страницы сайта, например, блога
3. Данные объединяются в массив, из которого исключаются страницы с мета тегами `excludeFromSitemap` и `canonical`
4. Заголовок страницы (`title`) формируется на основе мета-данных `sitemapTitle` или содержимого блока `banner-block`.

*Выходные данные:* Status: `200 OK`

Возвращает объекты страниц карты сайта

```json
{
  id: page.id,
  url: page.url,
  title: string,
  updatedAt: page.updated_at,
  sitemapConfig: page.sitemapConfig,
};
```

### Получение sitemap

`GET nest/api/pages/sitemap/`

Аналогичен [[#Получение страницы Карта сайта]], но выполняется поиск по ключу `pages-for-sitemap`. Используется для [[Формирование sitemap|создания sitemap.xml]].

### Получение страницы Мобильного приложения «Онлайн‑школа. Наука в AR»

`GET nest/api/pages/cosmos-data/`

*Входные данные:* отсутствуют

*Функционал:*

Выполняет поиск в кэше Redis по ключу `cosmos-data`, если данные не найдены, обращается к Strapi для получения страницы Cosmos (API ID: cosmos). Сохраняет данные в кэш и возвращает их.

*Выходные данные:* Status: `200 OK`

Возвращает данные страницы Cosmos из Strapi и CosmosDto

```json
{
  header: string;
  whatIsText: string;
  functionsHeader: string;
  functions?: ImgWithTitleAndText[];
  interestingHeader: string;
  interestingItems?: ImgWithTitleAndText[];
  bottomHeader: string;
  appStoreLink: string;
  googlePlayLink: string;
  meta?: Meta;
}
```

ImgWithTitleAndText:

```json
{
  title: string;
  text: string;
}
```

Meta:

```json
{
  pageName?: string;
  title?: string;
  description?: string;
  canonical?: string;
  isFaqPage?: boolean;
  excludeFromSitemap?: boolean;
  breadcrumbTitle?: string;
  sitemapTitle?: string;
}
```

### Получение страницы мобильного приложения Цифровая библиотека

`GET nest/api/pages/biblioteka-data/`

*Входные данные:* отсутствуют

*Функционал:*

Выполняет поиск в кэше Redis по ключу `biblioteka-data`, если данные не найдены, обращается к Strapi для получения страницы Biblioteka (API ID: biblioteka). Сохраняет данные в кэш и возвращает их.

*Выходные данные:* Status: `200 OK`

Возвращает данные страницы Biblioteka из Strapi и BibliotekaDto

```json
{
  header: string;
  aboutText: string;
  functionsHeader: string;
  functions?: ImgWithTitleAndText[];
  interestingHeader: string;
  interestingItems?: ImgWithTitleAndText[];
  bottomHeader: string;
  appStoreLink: string;
  googlePlayLink: string;
  meta?: Meta;
}
```

ImgWithTitleAndText:

```json
{
  title: string;
  text: string;
}
```

Meta:

```json
{
  pageName?: string;
  title?: string;
  description?: string;
  canonical?: string;
  isFaqPage?: boolean;
  excludeFromSitemap?: boolean;
  breadcrumbTitle?: string;
  sitemapTitle?: string;
}
```

### Переместить страницу в черновик

`POST nest/api/pages/deactivate/`

*Входные данные:*

- В тело запроса должны быть переданы следующие параметры:

| Параметр     | Тип данных | Валидация    | Описание                                |
| ------------ | ---------- | ------------ | --------------------------------------- |
| redirectUrls | string[]   | Обязательный | URL страниц для перемещения в черновики |

*Функционал:*

Находит в коллекции Pages Strapi страницы с указанными URL и устанавливает для них в поле `published_at` значение null.

*Выходные данные:* Status: `200 OK`