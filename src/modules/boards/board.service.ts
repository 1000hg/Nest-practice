import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async createInfo(createBoardDto: CreateBoardDto): Promise<Board> {
    const { user_id, category_id, title, description, image_url } =
      createBoardDto;

    const board = await this.boardRepository.create({
      user_id,
      category_id,
      title,
      description,
      image_url,
    });

    return this.boardRepository.save(board);
  }

  async readByBoardAll(
    filters?: Partial<Board>,
    orderBy?: { field: keyof Board; direction: 'ASC' | 'DESC' },
  ): Promise<Board[]> {
    const where: Partial<Board> = {};

    if (filters?.category_id) {
      where.category_id = filters.category_id;
    }

    if (filters?.is_active) {
      where.is_active = filters.is_active;
    }

    const order: { [key in keyof Board]?: 'ASC' | 'DESC' } = {};

    if (orderBy) {
      order[orderBy.field] = orderBy.direction;
    }

    return this.boardRepository.find({
      where,
      order,
    });
  }
}
