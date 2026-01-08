import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { MockDataSource } from 'src/common/data-sources/mock.data-source';
import { DataSourceFactoryImpl, DataSourceType } from 'src/common/data-sources/data-source.factory';
import { TransactionSubject } from 'src/common/observers/transaction.observer';
import { AnalyticsObserver } from 'src/common/observers/analytics.observer';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockDataSource: MockDataSource;
  let transactionSubject: TransactionSubject;

  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCategoryRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    mockDataSource = new MockDataSource();
    transactionSubject = new TransactionSubject();
    const analyticsObserver = new AnalyticsObserver();
    transactionSubject.attach(analyticsObserver);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: MockDataSource,
          useValue: mockDataSource,
        },
        {
          provide: TransactionSubject,
          useValue: transactionSubject,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    mockDataSource.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('должен создать транзакцию с категорией', async () => {
      const userId = 'user-1';
      const categoryId = 'category-1';
      const createDto = {
        amount: 100,
        type: 'expense' as const,
        note: 'Test transaction',
        categoryId,
      };

      const mockCategory: Category = {
        id: categoryId,
        name: 'Food',
        type: 'expense',
        user: { id: userId } as any,
        created_at: new Date(),
      } as Category;

      const mockTransaction: Transaction = {
        id: 'transaction-1',
        amount: 100,
        type: 'expense',
        note: 'Test transaction',
        category: mockCategory,
        user: { id: userId } as any,
        created_at: new Date(),
      } as Transaction;

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(userId, createDto);

      expect(result).toBe(mockTransaction.id);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: categoryId,
          user: { id: userId },
        },
      });
      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('должен создать транзакцию без категории', async () => {
      const userId = 'user-1';
      const createDto = {
        amount: 100,
        type: 'income' as const,
        note: 'Test transaction',
      };

      const mockTransaction: Transaction = {
        id: 'transaction-1',
        amount: 100,
        type: 'income',
        note: 'Test transaction',
        category: null,
        user: { id: userId } as any,
        created_at: new Date(),
      } as Transaction;

      mockTransactionRepository.create.mockReturnValue(mockTransaction);
      mockTransactionRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(userId, createDto);

      expect(result).toBe(mockTransaction.id);
      expect(mockCategoryRepository.findOne).not.toHaveBeenCalled();
      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(mockTransactionRepository.save).toHaveBeenCalled();
    });

    it('должен выбросить ошибку, если категория не найдена', async () => {
      const userId = 'user-1';
      const categoryId = 'non-existent-category';
      const createDto = {
        amount: 100,
        type: 'expense' as const,
        categoryId,
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.create(userId, createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('должен вернуть все транзакции пользователя', async () => {
      const userId = 'user-1';
      const mockTransactions: Transaction[] = [
        {
          id: 'transaction-1',
          amount: 100,
          type: 'expense',
          user: { id: userId } as any,
          created_at: new Date(),
        } as Transaction,
        {
          id: 'transaction-2',
          amount: 200,
          type: 'income',
          user: { id: userId } as any,
          created_at: new Date(),
        } as Transaction,
      ];

      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockTransactions);
      expect(mockTransactionRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('должен вернуть транзакцию по ID', async () => {
      const userId = 'user-1';
      const transactionId = 'transaction-1';
      const mockTransaction: Transaction = {
        id: transactionId,
        amount: 100,
        type: 'expense',
        user: { id: userId } as any,
        created_at: new Date(),
      } as Transaction;

      mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(transactionId, userId);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionRepository.findOne).toHaveBeenCalledWith({
        where: { id: transactionId, user: { id: userId } },
      });
    });

    it('должен выбросить ошибку, если транзакция не найдена', async () => {
      const userId = 'user-1';
      const transactionId = 'non-existent-transaction';

      mockTransactionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(transactionId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFinancialAnalytics', () => {
    it('должен вернуть финансовую аналитику', async () => {
      const userId = 'user-1';
      const mockTransactions: Transaction[] = [
        {
          id: 'transaction-1',
          amount: 100,
          type: 'income',
          user: { id: userId } as any,
          category: null,
          created_at: new Date(),
        } as Transaction,
        {
          id: 'transaction-2',
          amount: 50,
          type: 'expense',
          user: { id: userId } as any,
          category: null,
          created_at: new Date(),
        } as Transaction,
      ];

      mockTransactionRepository.find.mockResolvedValue(mockTransactions);

      const result = await service.getFinancialAnalytics(userId);

      expect(result.totalIncome).toBe(100);
      expect(result.totalExpense).toBe(50);
      expect(result.balance).toBe(50);
      expect(result.incomeCount).toBe(1);
      expect(result.expenseCount).toBe(1);
      expect(result.totalTransactions).toBe(2);
    });

    it('должен выбросить ошибку при невалидной дате', async () => {
      const userId = 'user-1';
      const invalidDate = 'invalid-date';

      await expect(
        service.getFinancialAnalytics(userId, invalidDate),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
