import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly uploadDir = path.join(
    __dirname,
    '..',
    '..',
    'uploads',
    'board',
  );

  async optimizeAndSaveImage(file: Express.Multer.File): Promise<string> {
    const optimizedFileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, optimizedFileName);

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    return optimizedFileName;
  }

  async deleteImage(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new HttpException(
        'Failed to delete the file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
