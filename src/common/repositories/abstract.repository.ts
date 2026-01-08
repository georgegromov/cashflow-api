/**
 * Абстрактный класс репозитория
 * Реализует паттерн Repository Pattern
 * Предоставляет базовую функциональность для работы с данными
 */
export abstract class AbstractRepository<T> {
  /**
   * Найти все записи
   */
  abstract findAll(): Promise<T[]>;

  /**
   * Найти запись по ID
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Создать новую запись
   */
  abstract create(entity: Partial<T>): Promise<T>;

  /**
   * Обновить существующую запись
   */
  abstract update(id: string, entity: Partial<T>): Promise<T>;

  /**
   * Удалить запись
   */
  abstract delete(id: string): Promise<boolean>;

  /**
   * Найти записи по условию
   */
  abstract findBy(condition: Partial<T>): Promise<T[]>;
}
