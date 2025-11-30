import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IUpdateUserDto } from '../interfaces/users.interface';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements IUpdateUserDto
{
  username?: string | undefined;
  password_hash?: string | undefined;
}
