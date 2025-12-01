import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUserEntity } from '../interfaces/users.interface';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('users', { name: 'users' })
export class User implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 64, nullable: false })
  username: string;

  @Column({ select: false, nullable: false })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @OneToMany(() => Category, (c) => c.user)
  categories: Category[];
}
