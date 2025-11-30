import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserService } from './interfaces/users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const passwordHash = await bcrypt.hash(createUserDto.passwordHash, 10);

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      password_hash: passwordHash,
    });

    const createdUser = await this.usersRepository.save(newUser);
    return createdUser.id;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
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
