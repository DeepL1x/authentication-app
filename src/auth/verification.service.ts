import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class VerificationService {
  constructor(private readonly userService: UserService) {}
  async verifyEmail(token: string): Promise<void> {
    await this.userService.updateEmailVerificationStatus(token, true);
  }
}
