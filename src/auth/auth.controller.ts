import { Controller, UseGuards, Request, Post, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-email/:username')
  async verifyEmail(@Param('username') username: string) {
    await this.verificationService.verifyEmail(username);
    return { message: 'Email verified successfully' };
  }
}