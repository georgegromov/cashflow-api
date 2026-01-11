import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere } from "typeorm";
import { Category } from "src/categories/entities/category.entity";
import { AbstractRepository, IAbstractRepository } from "./abstract.repository";

/**
 * Конкретная реализация репозитория для категорий
 * Использует паттерн Repository Pattern
 */
@Injectable()
export class CategoryRepository
  extends AbstractRepository<Category>
  implements IAbstractRepository<Category>
{
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {
    super();
  }

  async findAll(): Promise<Category[]> {
    return this.repository.find({
      order: { created_at: "DESC" },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<Category>,
      relations: ["user"],
    });
  }

  async create(entity: Partial<Category>): Promise<Category> {
    const category = this.repository.create(entity);
    return this.repository.save(category);
  }

  async update(id: string, entity: Partial<Category>): Promise<Category> {
    await this.repository.update(id, entity);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Category with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findBy(condition: Partial<Category>): Promise<Category[]> {
    return this.repository.find({
      where: condition as FindOptionsWhere<Category>,
      relations: ["user"],
      order: { created_at: "DESC" },
    });
  }

  async findByUserId(userId: string): Promise<Category[]> {
    return this.repository.find({
      where: { user: { id: userId } } as FindOptionsWhere<Category>,
    });
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Category | null> {
    return this.repository.findOne({
      where: {
        id,
        user: { id: userId },
      } as FindOptionsWhere<Category>,
    });
  }
}
