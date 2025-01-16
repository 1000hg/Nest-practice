import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { JwtAuthGuard } from 'modules/auths/guards/jwt-auth.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('createInfo')
  @ApiOperation({ summary: '게시글 생성' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createInfo(
    @Req() req: any,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    createBoardDto.user_id = req.user.userId;
    return this.boardService.createInfo(createBoardDto);
  }
}
