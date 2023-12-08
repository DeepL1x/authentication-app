import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, mongo } from 'mongoose';
import { SharpService } from 'nestjs-sharp/dist/sharp.service';

@Injectable()
export class ImageService {
  private sizes = [
    { width: 100, height: 100, suffix: 's' },
    { width: 300, height: 300, suffix: 'm' },
    { width: 600, height: 600, suffix: 'l' },
  ];
  private gfs: mongo.GridFSBucket;
  constructor(
    @InjectConnection() private connection: Connection,
    private sharpService: SharpService,
  ) {
    this.gfs = new mongo.GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }
  
  async readStream(filename: string) {
    const stream = this.gfs.openDownloadStreamByName(filename);
    return stream;
  }

  async uploadImage(
    file,
    username: string,
  ): Promise<{ imgS: string; imgM: string; imgL: string }> {
    const originalBuffer = file.buffer;
    const processedImgs = await Promise.all(
      this.sizes.map(
        async (size) => await this.processImage(size, originalBuffer),
      ),
    );
    const links = await Promise.all(
      processedImgs.map(async (img) =>
        this.saveToGridFS(img.buffer, img.size, username),
      ),
    );
    return {
      imgS: links.filter(({ size }) => size === 's')[0]?.link,
      imgM: links.filter(({ size }) => size === 'm')[0]?.link,
      imgL: links.filter(({ size }) => size === 'l')[0]?.link,
    };
  }
  private async processImage(size, buffer) {
    const processedBuffer = await this.sharpService
      .edit(buffer)
      .resize({ width: size.width, height: size.height })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer();

    return {
      size: size.suffix,
      buffer: processedBuffer,
    };
  }
  private async saveToGridFS(
    buffer,
    size,
    username,
  ): Promise<{ size: string; link: string }> {
    return new Promise((resolve, reject) => {
      const writeStream = this.gfs.openUploadStream(
        `${username}-image-${size}.jpg`,
      );

      writeStream.write(buffer);

      // When the write is complete, close the stream
      writeStream.end(() => {
        resolve({
          size: size,
          link: `${process.env.HOST}/image/${username}-image-${size}.jpg`,
        });
      });

      // Handle errors during the write
      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  }
}
