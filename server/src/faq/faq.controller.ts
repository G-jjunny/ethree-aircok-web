import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FaqService } from './faq.service';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';
import { CreateFaqItemDto } from './dto/create-faq-item.dto';
import { UpdateFaqItemDto } from './dto/update-faq-item.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // 공개 엔드포인트
  @Get('categories')
  findAllCategories() {
    return this.faqService.findAllCategories();
  }

  @Get('items')
  findAllItems(@Query('categoryId') categoryId?: string) {
    return this.faqService.findAllItems(categoryId);
  }

  // 관리자 엔드포인트
  @UseGuards(JwtAuthGuard)
  @Post('categories')
  createCategory(@Body() dto: CreateFaqCategoryDto) {
    return this.faqService.createCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateFaqCategoryDto) {
    return this.faqService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategory(@Param('id') id: string) {
    return this.faqService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('items')
  createItem(@Body() dto: CreateFaqItemDto) {
    return this.faqService.createItem(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateFaqItemDto) {
    return this.faqService.updateItem(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteItem(@Param('id') id: string) {
    return this.faqService.deleteItem(id);
  }
}
