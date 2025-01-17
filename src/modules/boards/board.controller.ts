import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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

  @Get('readByBoardAll')
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: Number,
    description: '카테고리 ID',
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    type: Boolean,
    description: '활성화 여부',
  })
  @ApiQuery({
    name: 'order_direction',
    required: false,
    type: String,
    enum: ['ASC', 'DESC'],
    description: '정렬 방향',
  })
  @ApiOperation({ summary: '게시글 조회' })
  async readByBoardAll(
    @Query('category_id') category_id?: number,
    @Query('is_active') is_active?: boolean,
    @Query('created_at') created_at?: keyof Board,
    @Query('order_direction') order_direction?: 'ASC' | 'DESC',
  ): Promise<Board[]> {
    const filters: Partial<Board> = {};
    if (category_id) {
      filters.category_id = category_id;
    }
    if (is_active !== undefined) {
      filters.is_active = is_active;
    }

    const orderBy =
      created_at && order_direction
        ? { field: created_at, direction: order_direction }
        : undefined;

    return this.boardService.readByBoardAll(filters, orderBy);
  }
}
