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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity('users', { name: 'users' })
export class User implements IUserEntity {
  @ApiProperty({
    example: 'a3b6a7f1-9d88-4db4-9d3a-25e0e6f6e2bd',
    description: 'Unique identifier of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username',
    maxLength: 64,
    required: true,
  })
  @Column({ unique: true, length: 64, nullable: false })
  username: string;

  @ApiHideProperty()
  @Column({ select: false, nullable: false })
  password_hash: string;

  @ApiProperty({
    example: '2025-03-01T12:24:53.123Z',
    description: 'Datetime when the user was created',
  })
  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @ApiHideProperty()
  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @ApiHideProperty()
  @OneToMany(() => Category, (c) => c.user)
  categories: Category[];
}
