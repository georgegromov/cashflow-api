import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  ICreateUserDto,
  IUpdateUserDto,
  IUserEntity,
  IUsersService,
} from './interfaces/users.interface';
import * as bcrypt from 'bcrypt';
import { Category } from 'src/categories/entities/category.entity';
import { ICategoryEntity } from 'src/categories/interfaces/categories.interface';

type DefaultCategory = Omit<ICategoryEntity, 'id' | 'user' | 'created_at'>;

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: 'Еда', type: 'expense' },
  { name: 'Транспорт', type: 'expense' },
  { name: 'Аренда жилья', type: 'expense' },
  { name: 'Развлечение', type: 'expense' },
  { name: 'Комунальные услуги', type: 'expense' },
  { name: 'Красота и Здоровье', type: 'expense' },
  { name: 'Такси и Каршеринг', type: 'expense' },
  { name: 'Прочие расходы', type: 'expense' },
  { name: 'Зарплата', type: 'income' },
  { name: 'Проценты по вкладам', type: 'income' },
  { name: 'Пенсия', type: 'income' },
  { name: 'Стипендия', type: 'income' },
  { name: 'Кешбек', type: 'income' },
  { name: 'Доход от Аренды', type: 'income' },
  { name: 'Прочее', type: 'income' },
] as const;

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: ICreateUserDto): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = queryRunner.manager.create(User, {
        username: createUserDto.username,
        password_hash: createUserDto.password,
      });

      const createdUser = await queryRunner.manager.save(user);

      const categories = DEFAULT_CATEGORIES.map((c) =>
        queryRunner.manager.create(Category, {
          name: c.name,
          type: c.type,
          user: createdUser,
        }),
      );

      await queryRunner.manager.save(categories);

      await queryRunner.commitTransaction();
      return createdUser.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('User creation failed', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<IUserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(
    params: { userId: string } | { username: string },
    options?: { withPassword?: boolean },
  ): Promise<IUserEntity | null> {
    const { withPassword } = options || {};

    if ('userId' in params) {
      return await this.usersRepository.findOne({
        where: { id: params.userId },
        select: withPassword
          ? ['id', 'username', 'password_hash', 'created_at']
          : undefined,
      });
    }

    if ('username' in params) {
      return await this.usersRepository.findOne({
        where: { username: params.username },
        select: withPassword
          ? ['id', 'username', 'password_hash', 'created_at']
          : undefined,
      });
    }

    return null;
  }

  async update(id: string, updateUserDto: IUpdateUserDto): Promise<string> {
    const updateData: Partial<IUserEntity> = {
      username: updateUserDto.username,
    };

    if (updateUserDto.password) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.usersRepository.preload({
      id,
      ...updateData,
    });

    if (!user) {
      throw new NotFoundException(
        `User with id:${id} is not found`.toLowerCase(),
      );
    }

    const updatedUser = await this.usersRepository.save(user);
    return updatedUser.id;
  }

  async delete(id: string): Promise<string> {
    await this.usersRepository.delete({ id });
    return id;
  }
}
