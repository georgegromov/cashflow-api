import { Transaction } from "src/transactions/entities/transaction.entity";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";

/**
 * Интерфейс источника данных
 * Реализует паттерн Strategy Pattern
 * Позволяет использовать разные источники данных (БД, файл, мок)
 */
export interface IDataSource {
  /**
   * Получить все транзакции пользователя
   */
  getTransactions(userId: string): Promise<Transaction[]>;

  /**
   * Получить транзакцию по ID
   */
  getTransactionById(id: string, userId: string): Promise<Transaction | null>;

  /**
   * Создать транзакцию
   */
  createTransaction(
    userId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction>;

  /**
   * Получить все категории пользователя
   */
  getCategories(userId: string): Promise<Category[]>;

  /**
   * Получить категорию по ID
   */
  getCategoryById(id: string, userId: string): Promise<Category | null>;

  /**
   * Создать категорию
   */
  createCategory(
    userId: string,
    category: Partial<Category>,
  ): Promise<Category>;

  /**
   * Обновить категорию
   */
  updateCategory(
    id: string,
    userId: string,
    category: Partial<Category>,
  ): Promise<Category>;

  /**
   * Удалить категорию
   */
  deleteCategory(id: string, userId: string): Promise<boolean>;

  /**
   * Получить пользователя по ID
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Получить пользователя по username
   */
  getUserByUsername(username: string): Promise<User | null>;

  /**
   * Создать пользователя
   */
  createUser(user: Partial<User>): Promise<User>;
}
