import {
  type ITransactionEntity,
  type TransactionType,
} from '../interfaces/transactions.interface';

export class CreateTransactionDto implements ITransactionEntity {
  type: TransactionType;
  amount: number;
  categoryId?: string;
}
