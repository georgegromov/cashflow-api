import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IUpdateCategoryDto } from '../interfaces/categories.interface';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class UpdateCategoryDto
  extends PartialType(CreateCategoryDto)
  implements IUpdateCategoryDto
{
  @ApiProperty()
  readonly name?: string;
  @ApiProperty({ enum: ['income', 'expense'], required: false })
  readonly type?: 'income' | 'expense';
}
