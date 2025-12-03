import { ICreateCategoryDto } from '../interfaces/categories.interface';

export class CreateCategoryDto implements ICreateCategoryDto {
  readonly name: string;
}
