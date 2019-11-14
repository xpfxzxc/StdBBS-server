import { Controller, Get } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { JsonResponse } from '../../common/modals/json-response.modal';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async index() {
    const categories = await this.categoriesService.findAll();
    return new JsonResponse({
      code: 0,
      data: {
        categories,
      },
    });
  }
}
