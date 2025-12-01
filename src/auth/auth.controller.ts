import { Controller, Logger, Post } from '@nestjs/common';
import {
  IAuthController,
  SignInDto,
  SignUpDto,
} from './interfaces/auth.inferface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements IAuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(signUpDto: SignUpDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Post()
  signIn(signInDto: SignInDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  @Post()
  signOut(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
