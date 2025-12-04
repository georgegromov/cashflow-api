import type {
  ICreateTransactionDto,
  TransactionType,
} from '../interfaces/transactions.interface';

export class CreateTransactionDto implements ICreateTransactionDto {
  type: TransactionType;
  amount: number;
  categoryId?: string;
}
