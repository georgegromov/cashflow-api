import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ICreateTransactionDto } from './interfaces/transactions.interface';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(userId: string, createTransactionDto: ICreateTransactionDto) {
    if (createTransactionDto.categoryId) {
      const category = await this.transactionsRepository.findOne({
        where: {
          id: createTransactionDto.categoryId,
          user: { id: userId },
        },
      });

      if (!category) {
        this.logger.error('category does not exist or not belongs to user');
        throw new BadRequestException(
          `category with id:${createTransactionDto.categoryId} does not exists`,
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: createTransactionDto.categoryId },
    });

    const created = await this.transactionsRepository.save(transaction);
    return created.id;
  }

  findAll(userId: string) {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!transaction) {
      throw new NotFoundException(`transaction with id:${id} is not found`);
    }
    return transaction;
  }
}
