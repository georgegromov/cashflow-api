import { ICreateUserDto } from '../interfaces/users.interface';

export class CreateUserDto implements ICreateUserDto {
  readonly username: string;
  readonly passwordHash: string;
}
