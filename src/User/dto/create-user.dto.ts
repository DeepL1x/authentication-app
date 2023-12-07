export class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly avatar: string;
    verificationToken: string
    emailVerified: boolean;
  }