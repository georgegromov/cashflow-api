import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ICreateUserDto } from '../interfaces/users.interface';

@ApiSchema()
export class CreateUserDto implements ICreateUserDto {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly password: string;
}
