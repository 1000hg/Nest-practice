import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('board/upload-image')
  @UseInterceptors(FileInterceptor('imageFile'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const optimizedFileName = await this.fileService.optimizeAndSaveImage(file);
    const imageUrl = `/uploads/board/${optimizedFileName}`;
    return { imageUrl };
  }
}
