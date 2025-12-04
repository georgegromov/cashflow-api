import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/interfaces/auth.inferface';
import { ICategoryController } from './interfaces/categories.interface';
import { ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth('access_token')
@Controller('categories')
export class CategoriesController implements ICategoryController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() curretUser: JwtPayload,
  ) {
    return this.categoriesService.create(curretUser.sub, createCategoryDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@CurrentUser() curretUser: JwtPayload) {
    return this.categoriesService.findAll(curretUser.sub);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string, @CurrentUser() curretUser: JwtPayload) {
    return this.categoriesService.findOne(id, curretUser.sub);
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() curretUser: JwtPayload,
  ) {
    return this.categoriesService.update(id, curretUser.sub, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id') id: string, @CurrentUser() curretUser: JwtPayload) {
    return this.categoriesService.delete(id, curretUser.sub);
  }
}
