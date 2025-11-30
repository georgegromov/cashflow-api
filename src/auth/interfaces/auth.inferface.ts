export interface SignUpDto {
  readonly username: string;
  readonly password: string;
}

export interface SignInDto {
  readonly username: string;
  readonly password: string;
}

export type SignInReturn = { accessToken: string };

export interface IAuthService {
  signUp(signUpDto: SignUpDto): Promise<void>;
  signIn(signInDto: SignInDto): Promise<SignInReturn>;
  signOut(): Promise<void>;
}

export interface IAuthController {
  signUp(signUpDto: SignUpDto): Promise<void>;
  signIn(signInDto: SignInDto): Promise<void>;
  signOut(): Promise<void>;
}

export interface JwtPayload {
  sub: string;
  username: string;
}
