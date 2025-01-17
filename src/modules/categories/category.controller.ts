import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('createInfo')
  @ApiOperation({ summary: '카테고리 생성' })
  async createInfo(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createInfo(createCategoryDto);
  }

  @Get('readParentInfo')
  @ApiOperation({ summary: '부모 카테고리 호출' })
  async readParentInfo(): Promise<Category[]> {
    return this.categoryService.readParentInfo();
  }
}
