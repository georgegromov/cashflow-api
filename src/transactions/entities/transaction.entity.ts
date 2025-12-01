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

export type TransactionType = 'income' | 'expense';

@Entity('transactions', { name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type: TransactionType;

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
