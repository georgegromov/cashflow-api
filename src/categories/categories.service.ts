import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ICategoryService } from './interfaces/categories.interface';
import { CategoryRepository } from 'src/common/repositories/category.repository';

@Injectable()
export class CategoriesService implements ICategoryService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    // Использование паттерна Repository Pattern
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
      type: createCategoryDto.type,
      user: { id: userId },
    });

    const created = await this.categoriesRepository.save(category);
    return created.id;
  }

  async findAll(userId: string) {
    // Использование паттерна Repository Pattern
    return await this.categoryRepository.findByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    // Использование паттерна Repository Pattern
    const category = await this.categoryRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!category) {
      throw new NotFoundException(`category with id:${id} is not found`);
    }

    return category;
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const updateData: Partial<Category> = {
      name: updateCategoryDto.name,
      type: updateCategoryDto.type,
    };
    const category = await this.categoriesRepository.preload({
      id,
      user: { id: userId },
      ...updateData,
    });

    if (!category) {
      throw new NotFoundException(
        `category with id:${id} is not found`.toLowerCase(),
      );
    }

    const updatedCategory = await this.categoriesRepository.save(category);
    return updatedCategory.id;
  }

  async delete(id: string, userId: string) {
    await this.categoriesRepository.delete({ id, user: { id: userId } });
    return id;
  }
}
