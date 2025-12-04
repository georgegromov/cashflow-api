import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUserDto } from '../interfaces/users.interface';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements IUpdateUserDto
{
  @ApiProperty()
  username: string | undefined;

  @ApiProperty()
  password: string | undefined;
}
