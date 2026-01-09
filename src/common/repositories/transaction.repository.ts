import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { AbstractRepository } from './abstract.repository';

/**
 * Конкретная реализация репозитория для транзакций
 * Использует паттерн Repository Pattern
 */
@Injectable()
export class TransactionRepository extends AbstractRepository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {
    super();
  }

  async findAll(): Promise<Transaction[]> {
    return this.repository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<Transaction>,
      relations: ['category', 'user'],
    });
  }

  async create(entity: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.repository.create(entity);
    return this.repository.save(transaction);
  }

  async update(id: string, entity: Partial<Transaction>): Promise<Transaction> {
    await this.repository.update(id, entity);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findBy(condition: Partial<Transaction>): Promise<Transaction[]> {
    return this.repository.find({
      where: condition as FindOptionsWhere<Transaction>,
      relations: ['category', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Найти все транзакции пользователя
   */
  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.repository.find({
      where: { user: { id: userId } } as FindOptionsWhere<Transaction>,
      relations: ['category'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Найти транзакцию пользователя по ID
   */
  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Transaction | null> {
    return this.repository.findOne({
      where: {
        id,
        user: { id: userId },
      } as FindOptionsWhere<Transaction>,
      relations: ['category'],
    });
  }
}
