import { ApiProperty } from '@nestjs/swagger';
import { ISignInDto } from '../interfaces/auth.inferface';

export class SignInDto implements ISignInDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
