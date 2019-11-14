import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoryEntity } from './category.entity';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoriesService],
})
export class CategoriesModule {}
