import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUserDto } from '../interfaces/users.interface';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements IUpdateUserDto
{
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the new user',
  })
  username?: string | undefined;

  @ApiProperty({
    example: 'my_strong_password',
    description: 'Raw password (will be hashed)',
  })
  password_hash?: string | undefined;
}
