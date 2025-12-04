import { Response } from 'express';

export interface ISignUpDto {
  readonly username: string;
  readonly password: string;
}

export interface ISignInDto {
  readonly username: string;
  readonly password: string;
}

export type SignUpReturn = { accessToken: string };
export type SignInReturn = SignUpReturn;

export interface IAuthService {
  signUp(signUpDto: ISignUpDto): Promise<SignUpReturn>;
  signIn(signInDto: ISignInDto): Promise<SignInReturn>;
  signOut(): Promise<void>;
}

export interface IAuthController {
  signUp(signUpDto: ISignUpDto, res: Response): Promise<SignUpReturn>;
  signIn(signInDto: ISignInDto, res: Response): Promise<SignInReturn>;
  signOut(res: Response): Promise<void>;
}

export interface JwtPayload {
  sub: string;
}
