import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SharpModule } from 'nestjs-sharp';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO), SharpModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
