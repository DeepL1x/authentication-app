import {
  Controller,
  UseGuards,
  Request,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-email')
  async sendEmailVerification(@Request() req) {
    const { email, verificationToken } =
      await this.authService.getVerificationData(req.user.username);
    const verificationLink = `${process.env.HOST}/auth/email-verification/${verificationToken}`;
    this.mailService.sendVerificationEmail(email, verificationLink);
  }

  @Get('email-verification/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }
}
