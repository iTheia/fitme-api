import { Controller, Param, Get, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('*')
  findImage(@Param() params: { [key: string]: string }, @Res() res: Response) {
    const fullPath = params[0];
    const [dest, imageName] = fullPath.split('/').reduce(
      (acc, part, index, array) => {
        if (index === array.length - 1) {
          acc[1] = part;
        } else {
          acc[0] += part + '/';
        }
        return acc;
      },
      ['', ''],
    );

    return this.imagesService.findImage(imageName, dest, res);
  }
}
