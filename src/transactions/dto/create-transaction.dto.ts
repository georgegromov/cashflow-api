import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  ICreateTransactionDto,
  TransactionType,
} from '../interfaces/transactions.interface';

export class CreateTransactionDto implements ICreateTransactionDto {
  @ApiProperty({
    example: 'expense',
    enum: ['income', 'expense'],
    description: 'Тип транзакции',
    required: true,
  })
  type: TransactionType;
  @ApiProperty({
    example: 120.5,
    description: 'Сумма транзакции',
    required: true,
  })
  amount: number;
  @ApiPropertyOptional({
    example: 'a3b6a7f1-9d88-4db4-9d3a-25e0e6f6e2bd',
    description: 'Уникальный идентификатор выбранной категории.',
    required: false,
  })
  categoryId?: string;
}
