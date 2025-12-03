import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import {
  IAuthService,
  SignInDto,
  SignInReturn,
  SignUpDto,
  SignUpReturn,
} from './interfaces/auth.inferface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpReturn> {
    const { username, password } = signUpDto;

    const foundUser = await this.usersService.findOne({ username });
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hash = await bcrypt.hash(password, 10);

    const createdUserId = await this.usersService.create({
      username: username,
      passwordHash: hash,
    });

    this.logger.log(`new user registered: ${username}`);

    const payload = { sub: createdUserId };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async signIn(signInDto: SignInDto): Promise<SignInReturn> {
    const user = await this.usersService.findOne(
      {
        username: signInDto.username,
      },
      { withPassword: true },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(
      signInDto.password,
      user.password_hash,
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
