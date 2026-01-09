# PlantUML диаграммы проекта CashFlow API

## Описание диаграмм

### 1. domain-model.puml - Базовая иерархия классов (Модель предметной области)

Показывает модель приложения - сущности предметной области и их связи:

- **User** (Пользователь) - основная сущность системы
- **Transaction** (Транзакция) - доходы и расходы пользователя
- **Category** (Категория) - группировка транзакций
- Связи между сущностями (1:N, N:0..1)
- Типы транзакций и категорий (income/expense)

### 2. class-hierarchy.puml - Иерархия классов паттернов проектирования

Показывает иерархию наследования и реализации интерфейсов для всех паттернов:

- **Repository Pattern**: `AbstractRepository` → `TransactionRepository`, `CategoryRepository`
- **Strategy Pattern**: `IDataSource` ← `DatabaseDataSource`, `MockDataSource`
- **Abstract Factory Pattern**: `DataSourceFactory` → `DataSourceFactoryImpl`
- **Observer Pattern**: `ITransactionObserver` ← `AbstractTransactionObserver` → `AnalyticsObserver`

### 3. class-diagram.puml - Диаграмма классов

Полная диаграмма классов проекта, показывающая:

- Сущности предметной области (User, Transaction, Category)
- Все паттерны проектирования и их связи
- Сервисы и их зависимости
- Связи между классами

### 4. data-source-implementation.puml - Реализация источника данных

Детальная диаграмма реализации Strategy Pattern и Abstract Factory Pattern:

- Интерфейс `IDataSource` и его реализации
- Фабрика для создания источников данных
- Пример использования клиентом

### 5. data-source-sequence.puml - Последовательность создания источника данных

Диаграмма последовательности, показывающая процесс создания источника данных через фабрику.

## Как использовать

### Онлайн генерация

1. Откройте [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Скопируйте содержимое нужного `.puml` файла
3. Вставьте в редактор
4. Диаграмма сгенерируется автоматически

### Локальная генерация

#### Установка PlantUML

```bash
# Через npm
npm install -g node-plantuml

# Или через Java
# Скачайте plantuml.jar с https://plantuml.com/download
```

#### Генерация изображений

```bash
# PNG
plantuml -tpng docs/diagrams/*.puml

# SVG
plantuml -tsvg docs/diagrams/*.puml

# PDF
plantuml -tpdf docs/diagrams/*.puml
```

#### Через VS Code

Установите расширение "PlantUML" для VS Code:

1. Откройте `.puml` файл
2. Нажмите `Alt+D` для предпросмотра
3. Или `Ctrl+Shift+P` → "PlantUML: Export Current Diagram"

### Интеграция в документацию

Диаграммы можно встроить в Markdown документацию:

```markdown
![Иерархия классов](diagrams/class-hierarchy.png)
```

## Структура диаграмм

```
docs/diagrams/
├── domain-model.puml              # Базовая иерархия классов (модель предметной области)
├── class-hierarchy.puml           # Иерархия классов паттернов проектирования
├── class-diagram.puml             # Полная диаграмма классов
├── data-source-implementation.puml # Реализация источника данных
├── data-source-sequence.puml      # Последовательность создания источника данных
└── README.md                      # Этот файл
```

## Обновление диаграмм

При изменении структуры классов обновите соответствующие `.puml` файлы:

- Добавление новой сущности → обновить `domain-model.puml` и `class-diagram.puml`
- Добавление нового репозитория → обновить `class-hierarchy.puml` и `class-diagram.puml`
- Добавление нового источника данных → обновить `class-hierarchy.puml`, `class-diagram.puml` и `data-source-implementation.puml`
- Изменение связей между классами → обновить `class-diagram.puml`
