---
date: 2024-10-30
tags:
  - Онлайн-школа
---
# CatalogModule

Модуль предназначен для работы с каталогами учебных программ и материалов.

***

## CatalogService

Предоставляет следующие методы:

| Имя                | Описание                                                |
| ------------------ | ------------------------------------------------------- |
| get                | Получить каталоги                                       |
| create             | Создать каталог                                         |
| update             | Обновить каталог                                        |
| duplicate          | Дублировать каталог                                     |
| moveToCatalog      | Переместить в каталог                                   |
| combine            |                                                         |
| changeStatus       |                                                         |
| delete             |                                                         |
| getTreeWithSelect  | Получение древа каталогов с выборкой дочерних сущностей |
| getTree            | Получение древа каталогов                               |
| duplicateTree      | Дублирование древа каталогов                            |
| getChildPagination |                                                         |
| getBreadcrumbs     |                                                         |

***

### get

*Входные данные:*

```json
{
  query: GetCatalogsDto {
    limit?: number;
    offset?: number;
    search?: string;
    catalogId?: string | null;
    sort?: (typeof sortFilters)[number]('name', 'classNumber', 'createdAt');
    sortDir?: 'ASC' | 'DESC';
    status?: CatalogStatus('ARCHIVE', 'ACTIVE');
  }
}
```

*Функционал:*

Создает запрос к базе данных для получения каталогов, с учетом переданных параметров.

Если `query.catalogId` не был передан, массив для хлебных крошек будет пуст. В противном случае выполняется дополнительный запрос для поиска родительского каталога, и если он был найден, формирует хлебные.

*Выходные данные:*

Возвращает объект, содержащий общее количество найденных элементов, информацию о каталогах и хлебные крошки (CatalogResponse).

```json
{
  count: number;
  catalogs: Catalog[];
  breadcrumbs: CatalogBreadcrumb[];
}
```

```json
Catalog {
  id: string;
  createdAt: Date;
  name: string;
  type: CatalogType('MATERIAL', 'PROGRAM');
  catalogId?: string | null;
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
}
```

```json
CatalogBreadcrumb {
  id: string;
  name: string;
}
```

### create

*Входные данные:*

```json
{
  name: string;
  catalogId?: string;
  status?: CatalogStatus('ARCHIVE', 'ACTIVE');
}
```

*Функционал:*

Создает новый каталог в базе данных, в соответствии с переданными параметрами.

*Выходные данные:*

Возвращает объект с информацией о созданном каталоге (Catalog).

```json
{
  id: string;
  createdAt: Date;
  name: string;
  type: CatalogType('MATERIAL', 'PROGRAM');
  catalogId?: string | null;
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
}
```

### update

*Входные данные:*

```json
{
  id: string | string[];
  dto: UpdateCatalogDto {
    name?: string;
    catalogId?: string;
    status?: CatalogStatus('ARCHIVE', 'ACTIVE');
  };
}
```

*Функционал:*

Выполняет запрос к базе данных для обновления информации о каталоге с переданным ID.

*Выходные данные:* -

### duplicate

*Входные данные:*

```json
{
  catalogs: string[] = [];
  childEntities: string[] = [];
}
```

*Функционал:*

Вызывает метод [getTreeWithSelect](#getTreeWithSelect), который позволяет получить массивы каталогов, дочерних элементов (учебных материалов и программ) и корневых каталогов для дублирования.

Выполняет поиск корневых дочерних элементов и после этого вызывает метод [duplicateTree](#duplicateTree) для создания копии древа каталога. Если полученные массивы созданных каталогов и дочерних элементов не пусты, сохраняет их в базе данных.

*Выходные данные:*

Возвращает массив идентификаторов созданных дочерних сущностей.

```json
{
  string[]
}
```

### moveToCatalog


*Входные данные:*

```json
{
  catalogs: string[] = [];
  childEntities: string[] = [];
  catalogId?: string | null;
}
```

*Функционал:*

Обновляет информацию в базе данных, для переданных каталогов и дочерних элементов (учебных материалов и программ).

Если массив `catalogs` не пуст, устанавливает для его элементов новое значение поля `catalogId`, переданное методу. Если массив `childEntities` не пуст, устанавливает для его элементов новое значение поля `catalogId`, переданное методу.


*Выходные данные:* -

### combine

*Входные данные:*

```json
{
  catalogs: string[] = [];
  childEntities: string[] = [];
  catalogId?: string | null;
}
```

*Функционал:*

Если хотя бы один из массивов (`catalogs` или `childEntities`) не пустой, создается новый каталог и именем "Новая папка".

Если массив `catalogs` не пуст, устанавливает для его элементов новое значение поля `catalogId`, указывая ID созданного каталога. Если массив `childEntities` не пуст, устанавливает для его элементов новое значение поля `catalogId`, указывая ID созданного каталога.

*Выходные данные:* -
### changeStatus

*Входные данные:*

```json
{
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
  rootCatalogs: string[] = [];
  rootChildren: string[] = [];
}
```

*Функционал:*

Если массив `rootCatalogs` не пуст, вызывает метод [getTree](#getTree), получая массив каталогов и дочерних элементов для обновления с противополложным?? статусом.

Если массив обновляемых каталогов не пуст, обновляет их статус на переданный. Выполняет тоже действие для переданных корневых каталогов и дополнительно меняет значение поля `catalogId: null`.

Если массив обновляемых дочерних сущностей не пуст, обновляет их статус на переданный. Выполняет тоже действие для переданных корневых дочерних сущностей и дополнительно меняет значение поля `catalogId: null`.

*Выходные данные:* -

Возвращает массив идентификаторов всех дочерних сущностей, статус которых был изменен.

```json
{
  string[]
}
```

### delete

### getTreeWithSelect

*Входные данные:*

```json
{
  catalogsInitial: string[],
  status?: CatalogStatus,
  not?: boolean,
}
```

*Функционал:*

Вызывает метод [getTree](#getTree) с переданными параметрами, а также задает новый: `withSelect: true`

*Выходные данные:*

Возвращает массив объектов, представляющих каталоги (Catalog), учебные материалы и программы (Children), а также корневые каталоги (Catalog).

```json
{
  Catalog[];
  Children[](Program | Material);
  Catalog[];
}
```

### getTree

*Входные данные:*

```json
{
  catalogsInitial: string[];
  status?: CatalogStatus('ARCHIVE', 'ACTIVE');
  not?: boolean;
  withSelect?: boolean;
}
```

*Функционал:*

Создает запрос к базе данных для получения древа каталогов и связанных с ними учебных материалов и программ. Фильтрует каталоги по статусу, если передан параметр `status`. Параметр `not` определяет, нужно ли исключать каталоги с указанным статусом. Если передан параметр `withSelect`, метод применяет выборку для дочерних сущностей (учебных материалов и программ).

Если ID полученного каталога содержится в `catalogsInitial`, он добавляется в массив корневых каталогов, иначе — в массив с каталогами.

*Выходные данные:*

Возвращает массив объектов, представляющих каталоги (Catalog), учебные материалы и программы (Children), а также корневые каталоги (Catalog).

```json
{
  Catalog[];
  Children[](Program | Material);
  Catalog[];
}
```

```json
Catalog {
  id: string;
  createdAt: Date;
  name: string;
  type: CatalogType('MATERIAL', 'PROGRAM');
  catalogId?: string | null;
  status: CatalogStatus('ARCHIVE', 'ACTIVE');
}
```

```json
Program {
  id: string;
  createdAt: Date;
  name: string;
  publicName?: string | null;
  description?: string | null;
  classNumber?: number | null;
  course: MAIN | ADDITIONAL;
  status: ARCHIVE | ACTIVE;
  subjectId?: string | null;
  subject?: Subject | null;
  autoNumberingLessons: boolean;
  catalogId?: string | null;
  logoId?: string | null;
  logo?: Upload | null;
  slug?: string | null;
  allowEvaluating: boolean;
  demoAccess: boolean;
  demoAccessPreschooler: boolean;
}
```

```json
MATERIAL {
  id: string;
  createdAt: Date;
  name: string;
  status: ARCHIVE | ACTIVE;
  type: VIDEO | TEXTBOOK | TEST | HOMEWORK | CONTROL_WORK | ESSAY | DICTATION | NARRATION | VERIFICATION_WORK | CONSULTATION | PRESENTATION | EXAM | OTHER;
  catalogId?: string | null;
  uploadId?: string | null;
  testId?: string | null;
  textbookId?: string | null;
  link?: string | null;
  previewUrl?: string | null;
  userId?: string | null;
  taskId?: string | null;
 }
```

### duplicateTree

*Входные данные:*

```json
{
  entityManager: EntityManager,
  duplicatingCatalogs: Catalog[],
  duplicatingChildren: Children[],
  rootCatalogs: Catalog[],
  rootChildren: Children[],
}
```

*Функционал:*

В методе реализована вложенная функция `duplicateChildren`, которая принимает ID родительского элемента и создает новую сущность для каждого дочернего элемента (учебные материалы и программы) и каталога. Функция вызывается рекурсивно для каждого дочернего каталога, создавая копии всех дочерних элементов.

Для каждого корневого учебного материала или программы создается копия с новым именем, к которому добавлено слово "(Копия)". Если учебный материал является тестом и содержит группы вопросов, устанавливаются индексы сортировки.

Для каждого корневого каталога создается копия с новым именем, к которому добавлено слово "(Копия)", и вызывается функция `duplicateChildren` для создания копии дочерних элементов.

*Выходные данные:*

Возвращает массивы, содержащие созданные каталоги (Catalog) и дочерние сущности (Children) учебных материалов и программ.

```json
{
  Catalog[];
  Children[](Program | Material);
}
```