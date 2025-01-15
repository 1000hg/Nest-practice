import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  async optimizeAndSaveImage(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(__dirname, '..', '..', '..', 'uploads', 'board');

    try {
      await fs.access(uploadDir);
    } catch (err) {
      await fs.mkdir(uploadDir);
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = join(uploadDir, fileName);

    await sharp(file.buffer).jpeg({ quality: 80 }).toFile(filePath);

    return fileName;
  }
}
