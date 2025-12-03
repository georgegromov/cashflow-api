import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUserService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      password_hash: createUserDto.passwordHash,
    });

    const createdUser = await this.usersRepository.save(newUser);
    return createdUser.id;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(
    params: { userId: string } | { username: string },
    options?: { withPassword?: boolean },
  ): Promise<User | null> {
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const updateData: Partial<User> = {
      username: updateUserDto.username,
    };

    if (updateUserDto.passwordHash) {
      updateData.password_hash = await bcrypt.hash(
        updateUserDto.passwordHash,
        10,
      );
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
