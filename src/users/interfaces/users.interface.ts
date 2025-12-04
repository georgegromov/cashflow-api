export interface IUserEntity {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface ICreateUserDto {
  readonly username: string;
  readonly passwordHash: string;
}

export interface IUpdateUserDto {
  readonly username?: string;
  readonly passwordHash?: string;
}

export interface IUsersService {
  create(createUserDto: ICreateUserDto): Promise<string>;
  findAll(): Promise<IUserEntity[]>;
  findOne(
    params: { userId: string } | { username: string },
    options?: { withPassword?: boolean },
  ): Promise<IUserEntity | null>;
  update(id: string, updateUserDto: IUpdateUserDto): Promise<string>;
  delete(id: string): Promise<string>;
}

export interface IUsersController {
  create(): Promise<void>;
  findAll(): Promise<IUserEntity[]>;
  findOne(): Promise<IUserEntity | null>;
  update(): void;
  delete(): Promise<void>;
}
