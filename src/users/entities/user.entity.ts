import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUserEntity } from '../interfaces/users.interface';

@Entity()
export class User implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 64, nullable: false })
  username: string;

  @Column({ select: false, nullable: false })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;
}
