import { ApiProperty } from '@nestjs/swagger';

export class CategoryAnalyticsDto {
  @ApiProperty({
    example: 'a3b6a7f1-9d88-4db4-9d3a-25e0e6f6e2bd',
    description: 'ID категории',
  })
  categoryId: string | null;

  @ApiProperty({
    example: 'Еда',
    description: 'Название категории',
    nullable: true,
  })
  categoryName: string | null;

  @ApiProperty({
    example: 'expense',
    enum: ['income', 'expense'],
    description: 'Тип категории',
    nullable: true,
  })
  categoryType: 'income' | 'expense' | null;

  @ApiProperty({
    example: 1500.75,
    description: 'Сумма транзакций в категории',
  })
  totalAmount: number;

  @ApiProperty({
    example: 15,
    description: 'Количество транзакций в категории',
  })
  transactionCount: number;

  @ApiProperty({
    example: 35.5,
    description: 'Процент от общей суммы (доходов или расходов)',
  })
  percentage: number;
}

export class FinancialAnalyticsDto {
  @ApiProperty({
    example: 50000.0,
    description: 'Общая сумма доходов',
  })
  totalIncome: number;

  @ApiProperty({
    example: 35000.0,
    description: 'Общая сумма расходов',
  })
  totalExpense: number;

  @ApiProperty({
    example: 15000.0,
    description: 'Баланс (доходы - расходы)',
  })
  balance: number;

  @ApiProperty({
    example: 25,
    description: 'Количество транзакций доходов',
  })
  incomeCount: number;

  @ApiProperty({
    example: 30,
    description: 'Количество транзакций расходов',
  })
  expenseCount: number;

  @ApiProperty({
    example: 55,
    description: 'Общее количество транзакций',
  })
  totalTransactions: number;

  @ApiProperty({
    type: [CategoryAnalyticsDto],
    description: 'Аналитика по категориям',
  })
  categoryAnalytics: CategoryAnalyticsDto[];
}
