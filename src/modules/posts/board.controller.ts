import { Body, Controller, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation } from '@nestjs/swagger';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('createInfo')
  @ApiOperation({ summary: '게시글 생성' })
  async createInfo(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.createInfo(createBoardDto);
  }
}
