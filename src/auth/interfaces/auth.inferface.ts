import { Response } from 'express';

export interface SignUpDto {
  readonly username: string;
  readonly password: string;
}

export interface SignInDto {
  readonly username: string;
  readonly password: string;
}

export type SignUpReturn = { accessToken: string };
export type SignInReturn = SignUpReturn;

export interface IAuthService {
  signUp(signUpDto: SignUpDto): Promise<SignUpReturn>;
  signIn(signInDto: SignInDto): Promise<SignInReturn>;
  signOut(): Promise<void>;
}

export interface IAuthController {
  signUp(signUpDto: SignUpDto, res: Response): Promise<SignUpReturn>;
  signIn(signInDto: SignInDto, res: Response): Promise<SignInReturn>;
  signOut(res: Response): Promise<void>;
}

export interface JwtPayload {
  sub: string;
}
