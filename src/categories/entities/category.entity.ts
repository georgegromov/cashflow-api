import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ICategoryEntity } from '../interfaces/categories.interface';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'Category',
  description: 'Сущность категории, принадлежащей определённому пользователю.',
})
@Unique(['user', 'name'])
@Entity('categories', { name: 'categories' })
export class Category implements ICategoryEntity {
  @ApiProperty({
    example: '3f4c3c9e-75a7-4d28-9b18-18e4e6fddc51',
    description: 'Уникальный идентификатор категории (UUID).',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Еда',
    description: 'Название категории.',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'income',
    description: 'Тип категории.',
  })
  @Column({
    type: 'enum',
    enum: ['income', 'expense'],
  })
  type: 'income' | 'expense';

  @ApiProperty({
    description: 'Пользователь, которому принадлежит категория.',
    type: () => User,
  })
  @ManyToOne(() => User, (u) => u.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: '2025-02-12T10:25:43.000Z',
    description: 'Дата создания категории.',
  })
  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;
}
