export interface IAbstractRepository<T> {
  /**
   * Найти все записи
   */
  findAll(): Promise<T[]>;
  /**
   * Найти запись по ID
   */
  findById(id: string): Promise<T | null>;
  /**
   * Создать новую запись
   */
  create(entity: Partial<T>): Promise<T>;
  /**
   * Обновить существующую запись
   */
  update(id: string, entity: Partial<T>): Promise<T>;
  /**
   * Удалить запись
   */
  delete(id: string): Promise<boolean>;
  /**
   * Найти записи по условию
   */
  findBy(condition: Partial<T>): Promise<T[]>;
}

/**
 * Абстрактный класс репозитория
 * Реализует паттерн Repository Pattern
 * Предоставляет базовую функциональность для работы с данными
 */
export abstract class AbstractRepository<T> implements IAbstractRepository<T> {
  abstract findAll(): Promise<T[]>;

  abstract findById(id: string): Promise<T | null>;

  abstract create(entity: Partial<T>): Promise<T>;

  abstract update(id: string, entity: Partial<T>): Promise<T>;

  abstract delete(id: string): Promise<boolean>;

  abstract findBy(condition: Partial<T>): Promise<T[]>;
}
