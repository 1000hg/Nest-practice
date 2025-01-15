import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PathUtil } from 'util/path.util';

@Controller('page')
export class FrontController {
  constructor(private readonly pathUtill: PathUtil) {}
  @Get('mypage')
  getSignupPage(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('mypage');
    return res.sendFile(filePath);
  }
}
