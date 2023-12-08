import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  gridFsStorage;
  constructor() {
    this.gridFsStorage = new GridFsStorage({
      url: process.env.MONGO,
      file: (req, file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
          const filename = file.originalname.trim();
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
            buffer: file.buffer,
          };
          req.file.buffer = file.buffer;
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
      fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed!'), false);
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(new Error('Image size is too large!'), false);
        } else {
          return cb(null, true);
        }
      },
    };
  }
}
