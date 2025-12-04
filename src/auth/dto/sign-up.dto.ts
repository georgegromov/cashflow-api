import { ApiProperty } from '@nestjs/swagger';
import { ISignUpDto } from '../interfaces/auth.inferface';

export class SignUpDto implements ISignUpDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
