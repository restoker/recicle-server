import { Injectable } from '@nestjs/common';
import { CreateCategoryDtoInput, CreateCategoryDtoOutput } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(file: Express.Multer.File, category: CreateCategoryDtoInput): Promise<CreateCategoryDtoOutput> {
    try {
      const uploadFile = await this.cloudinaryService.uploadFile(file);
      if (!uploadFile) {
        return { ok: false, msg: 'Error al crear la categoria' };
      }
      category.image = uploadFile.secure_url;
      const newCategory = this.categoriesRepository.create(category)
      await this.categoriesRepository.save(newCategory);
      return { ok: true, msg: 'Categoria creada correctamente' };
    } catch (e) {
      return { ok: false, msg: 'Error al crear la categoria' };
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
