import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PathUtil } from 'util/path.util';

@Controller('page')
export class FrontController {
  constructor(private readonly pathUtill: PathUtil) {}
  @Get('update-user')
  getUpdateUser(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('update-user');
    return res.sendFile(filePath);
  }

  @Get('write-board')
  getWriteBoard(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('write-board');
    return res.sendFile(filePath);
  }

  @Get('board-list')
  getBoardList(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('board-list');
    return res.sendFile(filePath);
  }

  @Get('like-board')
  getLikeBoard(@Res() res: Response) {
    const filePath = this.pathUtill.GetFilePath('like-board');
    return res.sendFile(filePath);
  }
}
