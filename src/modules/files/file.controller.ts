import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'modules/auths/guards/jwt-auth.guard';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('board/upload-image')
  @UseInterceptors(FileInterceptor('imageFile'))
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const optimizedFileName = await this.fileService.optimizeAndSaveImage(file);
    const imageUrl = `/uploads/board/${optimizedFileName}`;
    return { imageUrl };
  }

  @Delete('board/delete-image/:fileName')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteImage(@Param('fileName') fileName: string) {
    await this.fileService.deleteImage(fileName);
    return { message: '이미지가 삭제되었습니다.' };
  }
}
