import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { MockDataSource } from 'src/common/data-sources/mock.data-source';
import { Category } from 'src/categories/entities/category.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockDataSource: MockDataSource;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSourceInstance = {
    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    })),
  };

  beforeEach(async () => {
    mockDataSource = new MockDataSource();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSourceInstance,
        },
        {
          provide: MockDataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockDataSource.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('должен создать пользователя с категориями по умолчанию', async () => {
      const createDto = {
        username: 'testuser',
        password: 'hashedpassword',
      };

      const mockUser: User = {
        id: 'user-1',
        username: 'testuser',
        password_hash: 'hashedpassword',
        created_at: new Date(),
      } as User;

      const queryRunner = mockDataSourceInstance.createQueryRunner();
      queryRunner.manager.create
        .mockReturnValueOnce(mockUser)
        .mockReturnValue([]);
      queryRunner.manager.save
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce([]);

      const result = await service.create(createDto);

      expect(result).toBe(mockUser.id);
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('должен откатить транзакцию при ошибке', async () => {
      const createDto = {
        username: 'testuser',
        password: 'hashedpassword',
      };

      const queryRunner = mockDataSourceInstance.createQueryRunner();
      queryRunner.manager.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow();

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('должен вернуть всех пользователей', async () => {
      const mockUsers: User[] = [
        {
          id: 'user-1',
          username: 'user1',
          password_hash: 'hash1',
          created_at: new Date(),
        } as User,
        {
          id: 'user-2',
          username: 'user2',
          password_hash: 'hash2',
          created_at: new Date(),
        } as User,
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть пользователя по ID', async () => {
      const userId = 'user-1';
      const mockUser: User = {
        id: userId,
        username: 'testuser',
        password_hash: 'hash',
        created_at: new Date(),
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne({ userId });

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: undefined,
      });
    });

    it('должен вернуть пользователя по username', async () => {
      const username = 'testuser';
      const mockUser: User = {
        id: 'user-1',
        username,
        password_hash: 'hash',
        created_at: new Date(),
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne({ username });

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username },
        select: undefined,
      });
    });

    it('должен вернуть null, если пользователь не найден', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne({ userId: 'non-existent' });

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('должен обновить пользователя', async () => {
      const userId = 'user-1';
      const updateDto = {
        username: 'newusername',
      };

      const existingUser: User = {
        id: userId,
        username: 'oldusername',
        password_hash: 'hash',
        created_at: new Date(),
      } as User;

      const updatedUser: User = {
        ...existingUser,
        username: 'newusername',
      } as User;

      mockUserRepository.preload.mockResolvedValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateDto);

      expect(result).toBe(userId);
      expect(mockUserRepository.preload).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('должен выбросить ошибку, если пользователь не найден', async () => {
      const userId = 'non-existent';
      const updateDto = {
        username: 'newusername',
      };

      mockUserRepository.preload.mockResolvedValue(null);

      await expect(service.update(userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('должен удалить пользователя', async () => {
      const userId = 'user-1';

      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(userId);

      expect(result).toBe(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: userId });
    });
  });
});
