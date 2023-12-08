import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { GridFsMulterConfigService } from './multer-config.service';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SharpModule } from 'nestjs-sharp';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO), SharpModule],
  controllers: [ImageController],
  providers: [GridFsMulterConfigService, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
