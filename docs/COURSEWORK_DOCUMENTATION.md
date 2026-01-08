# Контрольная работа

по дисциплине: Введение в разработку программного обеспечения

на тему: Создание приложения с использованием паттернов проектирования

---

## Содержание

1. [Введение](#введение)
2. [Постановка задачи, варианты использования и планирование](#постановка-задачи-варианты-использования-и-планирование)
3. [Архитектура проекта и реализованные паттерны](#архитектура-проекта-и-реализованные-паттерны)
   - 3.1 [Общая архитектура и паттерны](#31-общая-архитектура-и-паттерны)
   - 3.2 [Repository Pattern](#32-repository-pattern)
   - 3.3 [Strategy Pattern](#33-strategy-pattern)
   - 3.4 [Abstract Factory Pattern](#34-abstract-factory-pattern)
   - 3.5 [Observer Pattern](#35-observer-pattern)
   - 3.6 [Модульные тесты с мокированием](#36-модульные-тесты-с-мокированием)
4. [Заключение](#заключение)
5. [Список использованных источников](#список-использованных-источников)

---

## Введение

В данной работе рассматривается REST API приложение для управления личными финансами (CashFlow API), разработанное на платформе NestJS с использованием TypeScript. Приложение позволяет пользователям отслеживать доходы и расходы, управлять категориями транзакций и получать финансовую аналитику.

Приложение работает с разными источниками данных, включая базу данных PostgreSQL (через TypeORM), а также моковый источник данных для тестирования. Технологии реализации: NestJS, TypeORM, PostgreSQL, JWT для аутентификации, Swagger для документации API.

В проекте реализованы следующие паттерны проектирования GoF (Gang of Four):

- **Repository Pattern** - для абстракции работы с данными
- **Strategy Pattern** - для работы с разными источниками данных
- **Abstract Factory Pattern** - для создания источников данных
- **Observer Pattern** - для обработки событий транзакций

---

## Постановка задачи, варианты использования и планирование

### Постановка задачи

Необходимо разработать REST API приложение для управления личными финансами с поддержкой:

- Аутентификации и авторизации пользователей
- Управления категориями доходов и расходов
- Создания и управления транзакциями
- Получения финансовой аналитики

Приложение должно поддерживать разные источники данных, включая базу данных PostgreSQL и моковый источник для тестирования.

### Варианты использования (Use Cases)

| №    | Название                          | Описание                                          | Сложность |
| ---- | --------------------------------- | ------------------------------------------------- | --------- |
| UC1  | Регистрация пользователя          | Пользователь создает новый аккаунт                | Средняя   |
| UC2  | Вход в систему                    | Пользователь авторизуется в системе               | Низкая    |
| UC3  | Создание транзакции               | Пользователь создает новую транзакцию             | Средняя   |
| UC4  | Просмотр списка транзакций        | Пользователь получает список всех транзакций      | Низкая    |
| UC5  | Просмотр транзакции по ID         | Пользователь получает детали транзакции           | Низкая    |
| UC6  | Получение финансовой аналитики    | Пользователь получает общую финансовую статистику | Высокая   |
| UC7  | Получение аналитики по категориям | Пользователь получает статистику по категориям    | Высокая   |
| UC8  | Создание категории                | Пользователь создает новую категорию              | Низкая    |
| UC9  | Просмотр списка категорий         | Пользователь получает список всех категорий       | Низкая    |
| UC10 | Просмотр категории по ID          | Пользователь получает детали категории            | Низкая    |
| UC11 | Обновление категории              | Пользователь обновляет данные категории           | Средняя   |
| UC12 | Удаление категории                | Пользователь удаляет категорию                    | Средняя   |

Подробное описание всех use cases представлено в файле `docs/USE_CASES.md`.

### Планирование

Таблица 1 – План версий и итераций

| История              | Сложность (ид. дней) | № итерации | № версии |
| -------------------- | -------------------- | ---------- | -------- |
| UC1, UC2             | 2                    | 1          | 1        |
| UC3, UC4, UC5        | 3                    | 2          | 1        |
| UC6, UC7             | 4                    | 3          | 1        |
| UC8, UC9, UC10       | 2                    | 4          | 1        |
| UC11, UC12           | 2                    | 5          | 1        |
| Реализация паттернов | 3                    | 6          | 2        |
| Моковые тесты        | 2                    | 7          | 2        |

---

## Архитектура проекта и реализованные паттерны

### 3.1 Общая архитектура и паттерны

Проект построен на основе модульной архитектуры NestJS, где каждый функциональный модуль (Users, Categories, Transactions, Auth) инкапсулирует свою бизнес-логику. Для обеспечения гибкости и расширяемости в проекте реализованы следующие паттерны проектирования:

1. **Repository Pattern** - абстракция для работы с данными
2. **Strategy Pattern** - выбор источника данных во время выполнения
3. **Abstract Factory Pattern** - создание источников данных
4. **Observer Pattern** - обработка событий транзакций

### Структура проекта

```
src/
├── auth/              # Модуль аутентификации
├── users/             # Модуль пользователей
├── categories/        # Модуль категорий
├── transactions/      # Модуль транзакций
├── common/            # Общие паттерны и утилиты
│   ├── repositories/  # Repository Pattern
│   ├── data-sources/  # Strategy и Abstract Factory
│   └── observers/     # Observer Pattern
└── database/          # Конфигурация БД
```

### 3.2 Repository Pattern

**Цель:** Абстрагировать работу с данными от конкретной реализации хранилища.

**Реализация:**

Создан абстрактный класс `AbstractRepository<T>`, который определяет базовый интерфейс для работы с данными:

```typescript
export abstract class AbstractRepository<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
  abstract findBy(condition: Partial<T>): Promise<T[]>;
}
```

**Преимущества:**

- Изоляция бизнес-логики от деталей работы с БД
- Возможность легкой замены источника данных
- Упрощение тестирования через моки

### 3.3 Strategy Pattern

**Цель:** Позволить приложению выбирать алгоритм работы с данными во время выполнения.

**Реализация:**

Создан интерфейс `IDataSource`, который определяет стратегию работы с данными:

```typescript
export interface IDataSource {
  getTransactions(userId: string): Promise<Transaction[]>;
  getTransactionById(id: string, userId: string): Promise<Transaction | null>;
  createTransaction(
    userId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction>;
  // ... другие методы
}
```

Реализованы две стратегии:

1. **DatabaseDataSource** - работа с PostgreSQL через TypeORM
2. **MockDataSource** - работа с данными в памяти для тестирования

**Преимущества:**

- Легкое переключение между источниками данных
- Возможность добавления новых источников (например, файловый)
- Изоляция логики работы с данными

**Пример использования:**

```typescript
// В конфигурации можно указать тип источника данных
const dataSource = dataSourceFactory.createDataSourceByType(
  DataSourceType.MOCK,
);
```

### 3.4 Abstract Factory Pattern

**Цель:** Создание семейств связанных объектов (источников данных) без указания их конкретных классов.

**Реализация:**

Создана абстрактная фабрика `DataSourceFactory` и её реализация `DataSourceFactoryImpl`:

```typescript
export abstract class DataSourceFactory {
  abstract createDataSource(): IDataSource;
}

export class DataSourceFactoryImpl extends DataSourceFactory {
  createDataSource(): IDataSource {
    const dataSourceType = this.configService.get<string>(
      'DATA_SOURCE_TYPE',
      'database',
    );

    switch (dataSourceType) {
      case DataSourceType.MOCK:
        return this.mockDataSource;
      case DataSourceType.DATABASE:
      default:
        return this.databaseDataSource;
    }
  }
}
```

**Преимущества:**

- Централизованное создание источников данных
- Легкое добавление новых типов источников
- Конфигурируемость через переменные окружения

### 3.5 Observer Pattern

**Цель:** Определить зависимость "один ко многим" между объектами так, чтобы при изменении состояния одного объекта все зависящие от него объекты получали уведомление.

**Реализация:**

Создан интерфейс `ITransactionObserver` и класс `TransactionSubject`:

```typescript
export interface ITransactionObserver {
  onTransactionCreated(transaction: Transaction): Promise<void> | void;
  onTransactionUpdated(transaction: Transaction): Promise<void> | void;
  onTransactionDeleted(transactionId: string): Promise<void> | void;
}

export class TransactionSubject {
  private observers: ITransactionObserver[] = [];

  attach(observer: ITransactionObserver): void { ... }
  detach(observer: ITransactionObserver): void { ... }
  async notifyTransactionCreated(transaction: Transaction): Promise<void> { ... }
}
```

Реализован конкретный наблюдатель `AnalyticsObserver` для логирования событий:

```typescript
@Injectable()
export class AnalyticsObserver extends AbstractTransactionObserver {
  async onTransactionCreated(transaction: Transaction): Promise<void> {
    this.logger.log(`Transaction created: ${transaction.id}`);
    // Здесь можно добавить логику для обновления аналитики
  }
}
```

**Преимущества:**

- Слабая связанность между компонентами
- Легкое добавление новых наблюдателей
- Возможность обработки событий асинхронно

**Пример использования:**

```typescript
// Подписка на события
transactionSubject.attach(analyticsObserver);

// Уведомление наблюдателей
await transactionSubject.notifyTransactionCreated(transaction);
```

### 3.6 Модульные тесты с мокированием

Для обеспечения качества кода написаны модульные тесты с использованием моков. Все тесты используют `MockDataSource` для изоляции от реальной базы данных.

**Пример теста для TransactionsService:**

```typescript
describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockDataSource: MockDataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: MockDataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('должен создать транзакцию с категорией', async () => {
    // Arrange
    const createDto = { amount: 100, type: 'expense', categoryId: 'cat-1' };

    // Act
    const result = await service.create('user-1', createDto);

    // Assert
    expect(result).toBeDefined();
  });
});
```

**Покрытие тестами:**

- `TransactionsService` - тесты для создания, получения, аналитики
- `UsersService` - тесты для CRUD операций с пользователями
- `CategoriesService` - тесты для CRUD операций с категориями

**Преимущества мокирования:**

- Быстрое выполнение тестов (без обращения к БД)
- Изоляция тестов друг от друга
- Возможность тестирования граничных случаев

---

## Заключение

В ходе выполнения работы было разработано REST API приложение для управления личными финансами с использованием современных технологий (NestJS, TypeORM, PostgreSQL) и паттернов проектирования.

Реализованные паттерны GoF позволили:

- **Repository Pattern** - абстрагировать работу с данными и упростить тестирование
- **Strategy Pattern** - обеспечить гибкость в выборе источника данных
- **Abstract Factory Pattern** - централизовать создание источников данных
- **Observer Pattern** - реализовать слабосвязанную обработку событий

Приложение поддерживает все заявленные use cases, имеет модульную архитектуру, покрыто модульными тестами с использованием моков. Код следует принципам SOLID и best practices NestJS.

Дальнейшее развитие проекта может включать:

- Добавление файлового источника данных (CSV, JSON)
- Реализацию кэширования для улучшения производительности
- Добавление веб-сокетов для real-time обновлений
- Расширение аналитики (графики, прогнозы)

---

## Список использованных источников

1. NestJS Documentation. [Электронный ресурс] Режим доступа: https://docs.nestjs.com/ (дата обращения: 2025-01-XX)

2. TypeORM Documentation. [Электронный ресурс] Режим доступа: https://typeorm.io/ (дата обращения: 2025-01-XX)

3. Gamma, E., Helm, R., Johnson, R., Vlissides, J. Design Patterns: Elements of Reusable Object-Oriented Software. - Addison-Wesley Professional, 1994.

4. Паттерны проектирования в TypeScript [Электронный ресурс] Режим доступа: https://refactoring.guru/ru/design-patterns/typescript (дата обращения: 2025-01-XX)

5. SOLID Principles [Электронный ресурс] Режим доступа: https://en.wikipedia.org/wiki/SOLID (дата обращения: 2025-01-XX)

6. Jest Documentation. [Электронный ресурс] Режим доступа: https://jestjs.io/ (дата обращения: 2025-01-XX)

7. Андреев, А.Е. Адаптивные технологии разработки программного обеспечения: учеб. пособие / А.Е. Андреев, С.И. Кирносенко; ВолгГТУ. - Волгоград, 2015. - 95 с.
