import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ICreateCategoryDto } from '../interfaces/categories.interface';

@ApiSchema()
export class CreateCategoryDto implements ICreateCategoryDto {
  @ApiProperty()
  readonly name: string;
}
