import { JwtPayload } from 'src/auth/interfaces/auth.inferface';
import { Category } from '../entities/category.entity';
import { User } from 'src/users/entities/user.entity';

export interface ICategoryEntity {
  id: string;
  name: string;
  type: 'income' | 'expense';
  user: User;
  created_at: Date;
}

export interface ICreateCategoryDto {
  readonly name: string;
  readonly type: 'income' | 'expense';
}

export interface IUpdateCategoryDto {
  readonly name?: string;
  readonly type?: 'income' | 'expense';
}

export interface ICategoryService {
  create(
    userId: string,
    createCategoryDto: ICreateCategoryDto,
  ): Promise<string>;
  findAll(userId: string): Promise<Category[]>;
  findOne(id: string, userId: string): Promise<Category>;
  update(
    id: string,
    userId: string,
    updateCategoryDto: IUpdateCategoryDto,
  ): Promise<string>;
  delete(id: string, userId: string): Promise<string>;
}
export interface ICategoryController {
  create(
    createCategoryDto: ICreateCategoryDto,
    curretUser: JwtPayload,
  ): Promise<string>;
  findAll(curretUser: JwtPayload): Promise<Category[]>;
  findOne(id: string, curretUser: JwtPayload): Promise<Category>;
  update(
    id: string,
    updateCategoryDto: IUpdateCategoryDto,
    curretUser: JwtPayload,
  ): Promise<string>;
  delete(id: string, curretUser: JwtPayload): Promise<string>;
}
