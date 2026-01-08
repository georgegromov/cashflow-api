import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { IDataSource } from './data-source.interface';

/**
 * Моковая реализация источника данных для тестирования
 * Хранит данные в памяти
 */
@Injectable()
export class MockDataSource implements IDataSource {
  private transactions: Map<string, Transaction> = new Map();
  private categories: Map<string, Category> = new Map();
  private users: Map<string, User> = new Map();
  private transactionCounter = 0;
  private categoryCounter = 0;
  private userCounter = 0;

  getTransactions(userId: string): Promise<Transaction[]> {
    return Promise.resolve(
      Array.from(this.transactions.values()).filter(
        (t) => t.user?.id === userId,
      ),
    );
  }

  getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    const transaction = this.transactions.get(id);
    if (transaction && transaction.user?.id === userId) {
      return Promise.resolve(transaction);
    }
    return Promise.resolve(null);
  }

  createTransaction(
    userId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: `mock-transaction-${++this.transactionCounter}`,
      amount: transaction.amount ?? 0,
      type: transaction.type ?? 'expense',
      note: transaction.note ?? null,
      user: { id: userId } as User,
      category: transaction.category ?? null,
      created_at: new Date(),
    } as Transaction;
    this.transactions.set(newTransaction.id, newTransaction);
    return Promise.resolve(newTransaction);
  }

  getCategories(userId: string): Promise<Category[]> {
    return Promise.resolve(
      Array.from(this.categories.values()).filter((c) => c.user?.id === userId),
    );
  }

  getCategoryById(id: string, userId: string): Promise<Category | null> {
    const category = this.categories.get(id);
    if (category && category.user?.id === userId) {
      return Promise.resolve(category);
    }
    return Promise.resolve(null);
  }

  createCategory(
    userId: string,
    category: Partial<Category>,
  ): Promise<Category> {
    const newCategory: Category = {
      id: `mock-category-${++this.categoryCounter}`,
      name: category.name ?? '',
      type: category.type ?? 'expense',
      user: { id: userId } as User,
      created_at: new Date(),
    } as Category;
    this.categories.set(newCategory.id, newCategory);
    return Promise.resolve(newCategory);
  }

  async updateCategory(
    id: string,
    userId: string,
    category: Partial<Category>,
  ): Promise<Category> {
    const existing = await this.getCategoryById(id, userId);
    if (!existing) {
      throw new Error('Category not found');
    }
    Object.assign(existing, category);
    this.categories.set(id, existing);
    return existing;
  }

  async deleteCategory(id: string, userId: string): Promise<boolean> {
    const category = await this.getCategoryById(id, userId);
    if (category) {
      this.categories.delete(id);
      return true;
    }
    return false;
  }

  getUserById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) ?? null);
  }

  getUserByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      Array.from(this.users.values()).find((u) => u.username === username) ??
        null,
    );
  }

  createUser(user: Partial<User>): Promise<User> {
    const newUser: User = {
      id: `mock-user-${++this.userCounter}`,
      username: user.username ?? '',
      password_hash: user.password_hash ?? '',
      created_at: new Date(),
    } as User;
    this.users.set(newUser.id, newUser);
    return Promise.resolve(newUser);
  }

  /**
   * Очистить все данные (для тестирования)
   */
  clear(): void {
    this.transactions.clear();
    this.categories.clear();
    this.users.clear();
    this.transactionCounter = 0;
    this.categoryCounter = 0;
    this.userCounter = 0;
  }
}
