import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageDocument, Image } from './Image.entity';
import { BaseRepository } from 'src/lib/BaseRepository';

@Injectable()
export class ImageRepository extends BaseRepository<ImageDocument> {
  constructor(
    @InjectModel(Image.name)
    private readonly ImageModel: Model<ImageDocument>,
  ) {
    super(ImageModel, Image.name, [
      'size',
      'format',
      'height',
      'width',
      'create_at',
    ]);
  }
}
