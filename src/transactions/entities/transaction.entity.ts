import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ITransactionEntity } from '../interfaces/transactions.interface';

@Entity('transactions', { name: 'transactions' })
export class Transaction implements ITransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type: 'income' | 'expense';

  @ManyToOne(() => User, (u) => u.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;
}
