import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  FindOptionsWhere,
} from "typeorm";
import { ICreateTransactionDto } from "./interfaces/transactions.interface";
import { Category } from "src/categories/entities/category.entity";
import {
  FinancialAnalyticsDto,
  CategoryAnalyticsDto,
} from "./dto/analytics-response.dto";
import { TransactionSubject } from "src/common/observers/transaction.observer";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    private readonly transactionSubject: TransactionSubject,
  ) {}

  async create(userId: string, createTransactionDto: ICreateTransactionDto) {
    let category: Category | null = null;

    if (createTransactionDto.categoryId) {
      category = await this.categoriesRepository.findOne({
        where: {
          id: createTransactionDto.categoryId,
          user: { id: userId },
        },
      });

      if (!category) {
        this.logger.error("category does not exist or not belongs to user");
        throw new BadRequestException(
          `category with id:${createTransactionDto.categoryId} does not exists`,
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      note: createTransactionDto.note,
      user: { id: userId },
      category,
    });

    const created = await this.transactionsRepository.save(transaction);

    // Уведомляем наблюдателей о создании транзакции (Observer Pattern)
    await this.transactionSubject.notifyTransactionCreated(created);

    return created.id;
  }

  findAll(userId: string) {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
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

  /**
   * Подготавливает условия для фильтрации по датам в SQL запросе
   */
  private buildDateFilter(
    startDate?: string,
    endDate?: string,
  ): Record<string, unknown> {
    const whereConditions: Record<string, unknown> = {};

    if (startDate && endDate) {
      // Если указаны обе даты, используем оператор Between для диапазона дат
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      whereConditions.created_at = Between(start, end);
    } else if (startDate) {
      // Только начальная дата
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      whereConditions.created_at = MoreThanOrEqual(start);
    } else if (endDate) {
      // Только конечная дата
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      whereConditions.created_at = LessThanOrEqual(end);
    }

    return whereConditions;
  }

  /**
   * Обрабатывает транзакции и возвращает аналитику по категориям
   */
  private processCategoryAnalytics(
    transactions: Transaction[],
  ): CategoryAnalyticsDto[] {
    // Словарь для группировки по категориям
    const categoryMap = new Map<
      string,
      {
        categoryId: string | null;
        categoryName: string | null;
        categoryType: "income" | "expense" | null;
        incomeAmount: number;
        expenseAmount: number;
        incomeCount: number;
        expenseCount: number;
      }
    >();

    // Обрабатываем каждую транзакцию
    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      const categoryId = transaction.category?.id || null;
      const categoryName = transaction.category?.name || null;
      const categoryType = transaction.category?.type || null;

      // Группировка по категориям
      const key = categoryId || "uncategorized";
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          categoryId,
          categoryName,
          categoryType,
          incomeAmount: 0,
          expenseAmount: 0,
          incomeCount: 0,
          expenseCount: 0,
        });
      }

      const categoryData = categoryMap.get(key)!;
      if (transaction.type === "income") {
        categoryData.incomeAmount += amount;
        categoryData.incomeCount++;
      } else {
        categoryData.expenseAmount += amount;
        categoryData.expenseCount++;
      }
    }

    // Формируем аналитику по категориям
    const categoryAnalytics: CategoryAnalyticsDto[] = [];

    // Подсчитываем общие суммы для расчета процентов
    let totalIncome = 0;
    let totalExpense = 0;
    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      if (transaction.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    }

    for (const [, categoryData] of categoryMap.entries()) {
      // Для категорий типа income показываем только income транзакции
      // Для категорий типа expense показываем только expense транзакции
      // Для транзакций без категории показываем оба типа
      const isIncomeCategory = categoryData.categoryType === "income";
      const isExpenseCategory = categoryData.categoryType === "expense";

      let totalAmount = 0;
      let transactionCount = 0;
      let totalForType = 0;

      if (isIncomeCategory) {
        totalAmount = categoryData.incomeAmount;
        transactionCount = categoryData.incomeCount;
        totalForType = totalIncome;
      } else if (isExpenseCategory) {
        totalAmount = categoryData.expenseAmount;
        transactionCount = categoryData.expenseCount;
        totalForType = totalExpense;
      } else {
        // Для транзакций без категории показываем сумму обоих типов
        totalAmount = categoryData.incomeAmount + categoryData.expenseAmount;
        transactionCount = categoryData.incomeCount + categoryData.expenseCount;
        totalForType = totalIncome + totalExpense;
      }

      // Вычисляем процент от общей суммы соответствующего типа
      const percentage =
        totalForType > 0 ? (totalAmount / totalForType) * 100 : 0;

      // Показываем категорию только если есть транзакции соответствующего типа
      if (totalAmount > 0) {
        categoryAnalytics.push({
          categoryId: categoryData.categoryId,
          categoryName: categoryData.categoryName || "Без категории",
          categoryType: categoryData.categoryType,
          totalAmount: Number(totalAmount.toFixed(2)),
          transactionCount,
          percentage: Number(percentage.toFixed(2)),
        });
      }
    }

    // Сортируем по сумме (от большей к меньшей)
    categoryAnalytics.sort((a, b) => b.totalAmount - a.totalAmount);

    return categoryAnalytics;
  }

  /**
   * Получить общую финансовую аналитику
   * Подсчитывает доходы, расходы, баланс и аналитику по категориям
   * Фильтрация по датам выполняется в SQL, все аналитические подсчеты - алгоритмически на бекенде
   */
  async getFinancialAnalytics(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<FinancialAnalyticsDto> {
    // Валидация дат
    if (startDate && isNaN(Date.parse(startDate))) {
      throw new BadRequestException(
        "startDate должен быть валидной датой в формате YYYY-MM-DD",
      );
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new BadRequestException(
        "endDate должен быть валидной датой в формате YYYY-MM-DD",
      );
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException("startDate не может быть позже endDate");
    }

    // Строим условия для фильтрации по датам в SQL
    const dateFilter = this.buildDateFilter(startDate, endDate);

    // Загружаем транзакции пользователя с фильтрацией по датам в SQL
    const whereConditions = {
      user: { id: userId },
      ...dateFilter,
    };

    const transactions = await this.transactionsRepository.find({
      where: whereConditions as FindOptionsWhere<Transaction>,
      relations: ["category"],
    });

    // Инициализируем счетчики
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    // Обрабатываем каждую транзакцию для общей статистики
    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      if (transaction.type === "income") {
        totalIncome += amount;
        incomeCount++;
      } else {
        totalExpense += amount;
        expenseCount++;
      }
    }

    // Получаем аналитику по категориям
    const categoryAnalytics = this.processCategoryAnalytics(transactions);

    return {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      balance: Number((totalIncome - totalExpense).toFixed(2)),
      incomeCount,
      expenseCount,
      totalTransactions: transactions.length,
      categoryAnalytics,
    };
  }

  /**
   * Получить аналитику по категориям
   * Возвращает детальную статистику по каждой категории
   * Фильтрация по датам выполняется в SQL, все аналитические подсчеты - алгоритмически на бекенде
   */
  async getCategoryAnalytics(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<CategoryAnalyticsDto[]> {
    // Валидация дат
    if (startDate && isNaN(Date.parse(startDate))) {
      throw new BadRequestException(
        "startDate должен быть валидной датой в формате YYYY-MM-DD",
      );
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new BadRequestException(
        "endDate должен быть валидной датой в формате YYYY-MM-DD",
      );
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new BadRequestException("startDate не может быть позже endDate");
    }

    // Строим условия для фильтрации по датам в SQL
    const dateFilter = this.buildDateFilter(startDate, endDate);

    // Загружаем транзакции пользователя с фильтрацией по датам в SQL
    const whereConditions = {
      user: { id: userId },
      ...dateFilter,
    };

    const transactions = await this.transactionsRepository.find({
      where: whereConditions as FindOptionsWhere<Transaction>,
      relations: ["category"],
    });

    // Все аналитические подсчеты выполняются алгоритмически на бекенде
    return this.processCategoryAnalytics(transactions);
  }
}
