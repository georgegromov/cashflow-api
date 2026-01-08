import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { IDataSource } from './data-source.interface';

/**
 * Реализация источника данных для базы данных PostgreSQL
 * Использует TypeORM для работы с БД
 */
@Injectable()
export class DatabaseDataSource implements IDataSource {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } } as FindOptionsWhere<Transaction>,
      order: { created_at: 'DESC' },
    });
  }

  async getTransactionById(
    id: string,
    userId: string,
  ): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: { id, user: { id: userId } } as FindOptionsWhere<Transaction>,
    });
  }

  async createTransaction(
    userId: string,
    transaction: Partial<Transaction>,
  ): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create({
      ...transaction,
      user: { id: userId } as User,
    });
    return this.transactionsRepository.save(newTransaction);
  }

  async getCategories(userId: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { user: { id: userId } } as FindOptionsWhere<Category>,
    });
  }

  async getCategoryById(
    id: string,
    userId: string,
  ): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { id, user: { id: userId } } as FindOptionsWhere<Category>,
    });
  }

  async createCategory(
    userId: string,
    category: Partial<Category>,
  ): Promise<Category> {
    const newCategory = this.categoriesRepository.create({
      ...category,
      user: { id: userId } as User,
    });
    return this.categoriesRepository.save(newCategory);
  }

  async updateCategory(
    id: string,
    userId: string,
    category: Partial<Category>,
  ): Promise<Category> {
    const existingCategory = await this.getCategoryById(id, userId);
    if (!existingCategory) {
      throw new Error('Category not found');
    }
    Object.assign(existingCategory, category);
    return this.categoriesRepository.save(existingCategory);
  }

  async deleteCategory(id: string, userId: string): Promise<boolean> {
    const result = await this.categoriesRepository.delete({
      id,
      user: { id: userId } as User,
    });
    return (result.affected ?? 0) > 0;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id } as FindOptionsWhere<User>,
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username } as FindOptionsWhere<User>,
    });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
