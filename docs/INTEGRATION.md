# Интеграция паттернов в приложение

## Обзор

Все созданные паттерны проектирования интегрированы в рабочий код приложения и используются в основных use cases.

## 1. Observer Pattern - Интеграция в TransactionsService

### Использование

**Файл:** `src/transactions/transactions.service.ts`

При создании транзакции автоматически уведомляются все наблюдатели:

```typescript
const created = await this.transactionsRepository.save(transaction);

// Уведомляем наблюдателей о создании транзакции (Observer Pattern)
await this.transactionSubject.notifyTransactionCreated(created);
```

### Подключение наблюдателей

**Файл:** `src/common/common.module.ts`

При инициализации модуля `AnalyticsObserver` автоматически подключается к `TransactionSubject`:

```typescript
onModuleInit() {
  // Подключаем наблюдателей при инициализации модуля
  this.transactionSubject.attach(this.analyticsObserver);
}
```

### Результат

- При создании транзакции автоматически логируется событие через `AnalyticsObserver`
- Легко добавить новых наблюдателей (например, для отправки уведомлений, обновления кэша и т.д.)

## 2. Repository Pattern - Интеграция в CategoriesService

### Использование

**Файл:** `src/categories/categories.service.ts`

Сервис использует `CategoryRepository` (наследник `AbstractRepository`) для работы с данными:

```typescript
constructor(
  @InjectRepository(Category)
  private categoriesRepository: Repository<Category>,
  // Использование паттерна Repository Pattern
  private readonly categoryRepository: CategoryRepository,
) {}

async findAll(userId: string) {
  // Использование паттерна Repository Pattern
  return await this.categoryRepository.findByUserId(userId);
}

async findOne(id: string, userId: string) {
  // Использование паттерна Repository Pattern
  const category = await this.categoryRepository.findByIdAndUserId(id, userId);
  // ...
}
```

### Преимущества

- Абстракция от деталей работы с БД
- Единообразный интерфейс для работы с данными
- Легкое тестирование через моки

## 3. Strategy Pattern и Abstract Factory - Готовы к использованию

### Доступные стратегии

1. **DatabaseDataSource** - работа с PostgreSQL через TypeORM
2. **MockDataSource** - работа с данными в памяти (для тестирования)

### Использование через фабрику

```typescript
// В любом сервисе можно использовать:
constructor(
  private readonly dataSourceFactory: DataSourceFactoryImpl,
) {}

// Получить источник данных
const dataSource = this.dataSourceFactory.createDataSource();
// или
const mockDataSource = this.dataSourceFactory.createDataSourceByType(DataSourceType.MOCK);
```

### Конфигурация

Тип источника данных можно настроить через переменную окружения `DATA_SOURCE_TYPE`:
- `database` (по умолчанию) - PostgreSQL
- `mock` - данные в памяти

## 4. Структура интеграции

```
src/
├── common/
│   ├── repositories/
│   │   ├── abstract.repository.ts          ✅ Базовый класс
│   │   ├── transaction.repository.ts       ✅ Реализация для транзакций
│   │   └── category.repository.ts          ✅ Реализация для категорий
│   ├── data-sources/
│   │   ├── data-source.interface.ts        ✅ Strategy Pattern
│   │   ├── database.data-source.ts          ✅ Стратегия БД
│   │   ├── mock.data-source.ts              ✅ Стратегия моков
│   │   └── data-source.factory.ts           ✅ Abstract Factory
│   ├── observers/
│   │   ├── transaction.observer.ts          ✅ Observer Pattern
│   │   └── analytics.observer.ts           ✅ Конкретный наблюдатель
│   └── common.module.ts                     ✅ Глобальный модуль
├── transactions/
│   ├── transactions.service.ts              ✅ Использует Observer Pattern
│   └── transactions.module.ts               ✅ Импортирует CommonModule
└── categories/
    ├── categories.service.ts                ✅ Использует Repository Pattern
    └── categories.module.ts                 ✅ Импортирует CommonModule
```

## 5. Use Cases, использующие паттерны

### UC3: Создание транзакции
- ✅ **Observer Pattern**: Уведомление наблюдателей при создании
- ✅ **Repository Pattern**: Работа с данными через репозиторий

### UC4, UC5: Просмотр транзакций
- ✅ **Repository Pattern**: Получение данных через репозиторий

### UC8, UC9, UC10, UC11, UC12: Работа с категориями
- ✅ **Repository Pattern**: Все операции через `CategoryRepository`

## 6. Примеры использования

### Добавление нового наблюдателя

```typescript
// Создать новый наблюдатель
@Injectable()
export class NotificationObserver extends AbstractTransactionObserver {
  onTransactionCreated(transaction: Transaction): void {
    // Отправить уведомление пользователю
  }
}

// Подключить в CommonModule
providers: [
  // ...
  NotificationObserver,
],
// В onModuleInit:
this.transactionSubject.attach(this.notificationObserver);
```

### Использование другого источника данных

```typescript
// В сервисе
constructor(
  private readonly dataSourceFactory: DataSourceFactoryImpl,
) {}

async getData() {
  // Переключиться на мок для тестирования
  const dataSource = this.dataSourceFactory.createDataSourceByType(DataSourceType.MOCK);
  return dataSource.getTransactions(userId);
}
```

## 7. Тестирование

Все паттерны поддерживают мокирование:
- `MockDataSource` - для тестирования стратегий
- Моки репозиториев - для тестирования сервисов
- Моки наблюдателей - для тестирования субъекта

Примеры тестов находятся в:
- `src/transactions/transactions.service.spec.ts`
- `src/users/users.service.spec.ts`
- `src/categories/categories.service.spec.ts`
