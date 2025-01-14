import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PathUtil } from 'util/path.util';

@Controller('page')
export class FrontController {
  constructor(private readonly pathUtill: PathUtil) {}
  @Get('signup')
  getSignupPage(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('signup');
    return res.sendFile(filePath);
  }

  @Get('login')
  getLoginPage(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('login');
    return res.sendFile(filePath);
  }
}
