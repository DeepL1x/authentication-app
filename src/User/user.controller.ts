import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from 'src/image/image.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private imageService: ImageService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const links = await this.imageService.uploadImage(
      file,
      createUserDto.username,
    );

    for (const size in links) {
      createUserDto[size] = links[size];
    }

    return await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.getFullUser(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @UploadedFile() file,
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (file) {
      const oldUser = await this.userService.getFullUser(req.user.username);
      const oldImages = {
        imgL: oldUser.imgL,
        imgM: oldUser.imgM,
        imgS: oldUser.imgS,
      };
      for (const size in oldImages) {
        this.imageService.deleteImage(oldImages[size]);
      }
      const links = await this.imageService.uploadImage(
        file,
        updateUserDto.username ?? req.user.username,
      );

      for (const size in links) {
        updateUserDto[size] = links[size];
      }
    }
    const updatedUser = await this.userService.update(
      req.user.username,
      updateUserDto,
    );
    return { message: 'Profile updated successfully', user: updatedUser };
  }
}
