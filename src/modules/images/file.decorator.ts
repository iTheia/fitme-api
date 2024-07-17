import { UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export function InterceptorsFile(
  dest: string,
  sizeFile: number,
  extensions: string[],
) {
  return UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: dest,
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}${fileExtName}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const fileExt = extname(file.originalname).toLowerCase();
        if (!extensions.includes(fileExt.substr(1))) {
          callback(
            new BadRequestException(`Extension ${fileExt} not allowed`),
            false,
          );
          return;
        }
        if (file.size > sizeFile) {
          callback(
            new BadRequestException(`File size exceeds ${sizeFile} bytes`),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  );
}
