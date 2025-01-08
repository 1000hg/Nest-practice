import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createInfo')
  @ApiOperation({ summary: '유저 생성' })
  async createInfo(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createInfo(createUserDto);
  }

  @Get('readByAll')
  @ApiOperation({ summary: '유저 전체 조회' })
  @ApiQuery({ name: 'name', required: false, description: '사용자 이름' })
  @ApiQuery({ name: 'email', required: false, description: '사용자 이메일' })
  @ApiQuery({
    name: 'is_active',
    required: false,
    description: '활성화 상태 (true/false)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '최대 사용자 수 (기본값: 10)',
  })
  async readByAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('is_active') is_active?: string,
    @Query('limit') limit?: string,
  ): Promise<User[]> {
    const filters: Partial<User> = {};

    if (name) filters.name = name;
    if (email) filters.email = email;
    if (is_active !== undefined) filters.is_active = is_active === 'true';

    const maxLimit = 100;
    const parsedLimit = Math.min(parseInt(limit, 10) || maxLimit, maxLimit);

    return this.userService.readByAll(filters, parsedLimit);
  }

  @Get('readById')
  @ApiOperation({ summary: 'id로 유저 조회' })
  async readById(@Query('id') id: number): Promise<User> {
    return this.userService.readById(id);
  }

  @Get('readByEmail')
  @ApiOperation({ summary: '이메일로 유저 조회' })
  async readByEmail(@Query('email') email: string): Promise<User> {
    return this.userService.readByEmail(email);
  }

  @Patch('updateInfo')
  @ApiOperation({ summary: '유저 수정' })
  async updateInfo(
    @Query('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateInfo(id, updateUserDto);
  }

  @Delete('deleteInfo')
  @ApiOperation({ summary: '유저 삭제' })
  async deleteInfo(@Query('id') id: number): Promise<void> {
    await this.userService.deleteInfo(id);
  }
}
