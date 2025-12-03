import { JwtPayload } from 'src/auth/interfaces/auth.inferface';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

export type TransactionType = 'income' | 'expense';

export interface ITransactionEntity {
  id: string;
  amount: number;
  type: TransactionType;
  user: User;
  category: Category | null;
  created_at: Date;
}

export interface ICreateTransactionDto {
  type: TransactionType;
  amount: number;
  categoryId?: string;
}

export interface ITransactionService {
  create(
    userId: string,
    createTransactionDto: ICreateTransactionDto,
  ): Promise<string>;
  findAll(userId: string): Promise<ITransactionEntity[]>;
  findOne(id: string, userId: string): Promise<ITransactionEntity>;
}

export interface ITransactionController {
  create(
    createTransactionDto: ICreateTransactionDto,
    curretUser: JwtPayload,
  ): Promise<string>;
  findAll(curretUser: JwtPayload): Promise<ITransactionEntity[]>;
  findOne(id: string, curretUser: JwtPayload): Promise<ITransactionEntity>;
}
