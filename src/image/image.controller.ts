import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get('/:filename')
  async serveImage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const stream = await this.imageService.readStream(filename);
      res.type('image/jpeg');
      return stream.pipe(res);
    } catch (error) {
      res.status(404).send('Not Found');
    }
  }
}
