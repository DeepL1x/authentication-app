import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { VerificationService } from './verification.service';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from 'src/mail/mail.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    PassportModule,
    JwtStrategy,
    VerificationService,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
