import { ApiProperty } from '@nestjs/swagger';
import { ICreateUserDto } from '../interfaces/users.interface';

export class CreateUserDto implements ICreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the new user',
  })
  readonly username: string;

  @ApiProperty({
    example: 'my_strong_password',
    description: 'Raw password (will be hashed)',
  })
  readonly passwordHash: string;
}
