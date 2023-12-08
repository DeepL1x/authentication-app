import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getFullUser(username);
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async verifyEmail(token: string): Promise<any> {
    const user = await this.userService.findByVerificationToken(token);

    if (user) {
      await this.userService.updateEmailVerificationStatus(user.username, true);
    }

    return user;
  }

  async getVerificationData(
    username: string,
  ): Promise<{ email: string; verificationToken: string }> {
    return this.userService.getVerificationData(username);
  }

  async login(user: UserDocument): Promise<any> {
    const payload = { username: user.username, sub: user._id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
