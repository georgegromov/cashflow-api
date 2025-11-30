import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import {
  IAuthService,
  SignInDto,
  SignInReturn,
  SignUpDto,
} from './interfaces/auth.inferface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  signUp(signUpDto: SignUpDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async signIn(signInDto: SignInDto): Promise<SignInReturn> {
    const user = await this.usersService.findOne(signInDto.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user?.password_hash !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user?.id, username: user?.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
