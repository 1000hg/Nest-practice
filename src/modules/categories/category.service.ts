import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly caregoryRepository: Repository<Category>,
  ) {}

  async createInfo(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { title, parent_id } = createCategoryDto;

    const category = await this.caregoryRepository.create({
      title,
      parent_id,
    });

    return this.caregoryRepository.save(category);
  }

  async readParentInfo(): Promise<Category[]> {
    return this.caregoryRepository.find({
      where: { parent_id: 0 },
    });
  }
}
