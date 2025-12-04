import { Body, Controller, HttpCode, Logger, Post, Res } from '@nestjs/common';
import {
  IAuthController,
  SignInReturn,
  SignUpReturn,
} from './interfaces/auth.inferface';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { type Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController implements IAuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(201)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignUpReturn> {
    const result = await this.authService.signUp(signUpDto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return result;
  }

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInReturn> {
    const result = await this.authService.signIn(signInDto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @Public()
  @Post('sign-out')
  @HttpCode(204)
  signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('access_token');
    res.status(204).send();
    return this.authService.signOut();
  }
}
