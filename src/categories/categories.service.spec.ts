import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesService } from "./categories.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { MockDataSource } from "src/common/data-sources/mock.data-source";
import { NotFoundException } from "@nestjs/common";

describe("CategoriesService", () => {
  let service: CategoriesService;
  let mockDataSource: MockDataSource;

  const mockCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    mockDataSource = new MockDataSource();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: MockDataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    mockDataSource.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("должен создать категорию", async () => {
      const userId = "user-1";
      const createDto = {
        name: "Food",
        type: "expense" as const,
      };

      const mockCategory: Category = {
        id: "category-1",
        name: "Food",
        type: "expense",
        user: { id: userId } as any,
        created_at: new Date(),
      } as Category;

      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(userId, createDto);

      expect(result).toBe(mockCategory.id);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith({
        name: createDto.name,
        type: createDto.type,
        user: { id: userId },
      });
      expect(mockCategoryRepository.save).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("должен вернуть все категории пользователя", async () => {
      const userId = "user-1";
      const mockCategories: Category[] = [
        {
          id: "category-1",
          name: "Food",
          type: "expense",
          user: { id: userId } as any,
          created_at: new Date(),
        } as Category,
        {
          id: "category-2",
          name: "Salary",
          type: "income",
          user: { id: userId } as any,
          created_at: new Date(),
        } as Category,
      ];

      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe("findOne", () => {
    it("должен вернуть категорию по ID", async () => {
      const userId = "user-1";
      const categoryId = "category-1";
      const mockCategory: Category = {
        id: categoryId,
        name: "Food",
        type: "expense",
        user: { id: userId } as any,
        created_at: new Date(),
      } as Category;

      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne(categoryId, userId);

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId, user: { id: userId } },
      });
    });

    it("должен выбросить ошибку, если категория не найдена", async () => {
      const userId = "user-1";
      const categoryId = "non-existent-category";

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(categoryId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("должен обновить категорию", async () => {
      const userId = "user-1";
      const categoryId = "category-1";
      const updateDto = {
        name: "Updated Food",
        type: "expense" as const,
      };

      const existingCategory: Category = {
        id: categoryId,
        name: "Food",
        type: "expense",
        user: { id: userId } as any,
        created_at: new Date(),
      } as Category;

      const updatedCategory: Category = {
        ...existingCategory,
        name: "Updated Food",
      } as Category;

      mockCategoryRepository.preload.mockResolvedValue(updatedCategory);
      mockCategoryRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update(categoryId, userId, updateDto);

      expect(result).toBe(categoryId);
      expect(mockCategoryRepository.preload).toHaveBeenCalled();
      expect(mockCategoryRepository.save).toHaveBeenCalled();
    });

    it("должен выбросить ошибку, если категория не найдена", async () => {
      const userId = "user-1";
      const categoryId = "non-existent";
      const updateDto = {
        name: "Updated Food",
      };

      mockCategoryRepository.preload.mockResolvedValue(null);

      await expect(
        service.update(categoryId, userId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("должен удалить категорию", async () => {
      const userId = "user-1";
      const categoryId = "category-1";

      mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(categoryId, userId);

      expect(result).toBe(categoryId);
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith({
        id: categoryId,
        user: { id: userId },
      });
    });
  });
});
