import { Module } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materiales } from './entities/materiale.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Materiales, Category]), CloudinaryModule],
  controllers: [MaterialesController],
  providers: [MaterialesService],
})
export class MaterialesModule { }
