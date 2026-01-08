# Реализованные паттерны проектирования GoF

## Краткое описание

В проекте CashFlow API реализованы следующие паттерны проектирования из каталога GoF (Gang of Four):

### 1. Repository Pattern (Паттерн Репозиторий)

**Файл:** `src/common/repositories/abstract.repository.ts`

**Описание:** Абстрактный класс для работы с данными, изолирующий бизнес-логику от деталей работы с хранилищем.

**Использование:** Базовый класс для создания репозиториев различных сущностей.

### 2. Strategy Pattern (Паттерн Стратегия)

**Файлы:**
- `src/common/data-sources/data-source.interface.ts` - интерфейс стратегии
- `src/common/data-sources/database.data-source.ts` - стратегия для БД
- `src/common/data-sources/mock.data-source.ts` - стратегия для моков

**Описание:** Позволяет выбирать алгоритм работы с данными во время выполнения. Реализованы две стратегии: работа с PostgreSQL и работа с данными в памяти.

**Использование:** Переключение между источниками данных через конфигурацию.

### 3. Abstract Factory Pattern (Паттерн Абстрактная Фабрика)

**Файл:** `src/common/data-sources/data-source.factory.ts`

**Описание:** Создание семейств связанных объектов (источников данных) без указания их конкретных классов.

**Использование:** Централизованное создание источников данных через фабрику.

### 4. Observer Pattern (Паттерн Наблюдатель)

**Файлы:**
- `src/common/observers/transaction.observer.ts` - интерфейс и субъект
- `src/common/observers/analytics.observer.ts` - конкретный наблюдатель

**Описание:** Определяет зависимость "один ко многим" между объектами. При изменении состояния транзакции все наблюдатели получают уведомление.

**Использование:** Обработка событий создания, обновления и удаления транзакций.

## Структура файлов

```
src/common/
├── repositories/
│   └── abstract.repository.ts          # Repository Pattern
├── data-sources/
│   ├── data-source.interface.ts         # Strategy Pattern (интерфейс)
│   ├── database.data-source.ts          # Strategy Pattern (БД)
│   ├── mock.data-source.ts              # Strategy Pattern (мок)
│   └── data-source.factory.ts           # Abstract Factory Pattern
└── observers/
    ├── transaction.observer.ts          # Observer Pattern
    └── analytics.observer.ts            # Observer Pattern (реализация)
```

## Моковые тесты

Все тесты используют `MockDataSource` для изоляции от реальной базы данных:

- `src/transactions/transactions.service.spec.ts`
- `src/users/users.service.spec.ts`
- `src/categories/categories.service.spec.ts`

## Документация

- `docs/USE_CASES.md` - описание всех use cases проекта
- `docs/COURSEWORK_DOCUMENTATION.md` - полная документация по шаблону курсовой работы
