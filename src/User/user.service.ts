import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: User): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const verificationToken = uuidv4();

    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
      verificationToken: verificationToken,
    });

    return createdUser.save();
  }

  async updateEmailVerificationStatus(
    username: string,
    status: boolean,
  ): Promise<void> {
    await this.userModel
      .updateOne({ username }, { $set: { emailVerified: status } })
      .exec();
  }

  async update(username: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      return this.userModel
        .findOneAndUpdate(
          { username },
          {
            ...updateUserDto,
            verificationToken: uuidv4(),
            emailVerified: false,
          },
          { new: true },
        )
        .exec();
    }
    return this.userModel
      .findOneAndUpdate({ username }, updateUserDto, { new: true })
      .exec();
  }
}
