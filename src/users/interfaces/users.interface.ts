import { User } from '../entities/user.entity';

export interface IUserEntity {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface ICreateUserDto {
  readonly username: string;
  readonly passwordHash: string;
}

export interface IUpdateUserDto {
  readonly username?: string;
  readonly passwordHash?: string;
}

export interface IUserService {
  create(createUserDto: ICreateUserDto): Promise<string>;
  findAll(): Promise<User[]>;
  findOne(
    params: { userId: string } | { username: string },
    options?: { withPassword?: boolean },
  ): Promise<User | null>;
  update(id: string, updateUserDto: IUpdateUserDto): Promise<string>;
  delete(id: string): Promise<string>;
}

export interface IUserController {
  create(): Promise<void>;
  findAll(): Promise<User[]>;
  findOne(): Promise<User | null>;
  update(): void;
  delete(): Promise<void>;
}
