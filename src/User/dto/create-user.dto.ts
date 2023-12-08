export class CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly email: string;
    readonly avatar: string;
    imgS: string;
    imgM: string;
    imgL: string;
    verificationToken: string
    emailVerified: boolean;
  }