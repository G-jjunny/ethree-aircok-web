import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqCategoryDto } from './dto/create-faq-category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq-category.dto';
import { CreateFaqItemDto } from './dto/create-faq-item.dto';
import { UpdateFaqItemDto } from './dto/update-faq-item.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    const data = await this.prisma.faqCategory.findMany({
      orderBy: { order: 'asc' },
    });
    return { data };
  }

  async createCategory(dto: CreateFaqCategoryDto) {
    const existing = await this.prisma.faqCategory.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`카테고리 이름 "${dto.name}"이 이미 존재합니다.`);
    }
    return this.prisma.faqCategory.create({
      data: {
        name: dto.name,
        order: dto.order ?? 0,
      },
    });
  }

  async updateCategory(id: string, dto: UpdateFaqCategoryDto) {
    const existing = await this.prisma.faqCategory.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`FaqCategory #${id} not found`);
    }

    // name 변경 시 중복 확인 (자기 자신은 제외)
    if (dto.name !== undefined && dto.name !== existing.name) {
      const nameConflict = await this.prisma.faqCategory.findUnique({
        where: { name: dto.name },
      });
      if (nameConflict) {
        throw new ConflictException(`카테고리 이름 "${dto.name}"이 이미 존재합니다.`);
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.faqCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.prisma.faqCategory.findUnique({
      where: { id },
      include: { _count: { select: { items: true } } },
    });
    if (!existing) {
      throw new NotFoundException(`FaqCategory #${id} not found`);
    }
    if (existing._count.items > 0) {
      throw new BadRequestException(
        '카테고리에 항목이 존재합니다. 먼저 항목을 삭제하세요.',
      );
    }
    await this.prisma.faqCategory.delete({ where: { id } });
  }

  async findAllItems(categoryId?: string) {
    const items = await this.prisma.faqItem.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: { select: { name: true, order: true } } },
      orderBy: [
        { category: { order: 'asc' } },
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return {
      data: items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.category.name,
        question: item.question,
        answer: item.answer,
        order: item.order,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  }

  async createItem(dto: CreateFaqItemDto) {
    const category = await this.prisma.faqCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`FaqCategory #${dto.categoryId} not found`);
    }

    const item = await this.prisma.faqItem.create({
      data: {
        categoryId: dto.categoryId,
        question: dto.question,
        answer: dto.answer,
        order: dto.order ?? 0,
      },
      include: { category: { select: { name: true } } },
    });

    return {
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.category.name,
      question: item.question,
      answer: item.answer,
      order: item.order,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async updateItem(id: string, dto: UpdateFaqItemDto) {
    const existing = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`FaqItem #${id} not found`);
    }

    if (dto.categoryId !== undefined) {
      const category = await this.prisma.faqCategory.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`FaqCategory #${dto.categoryId} not found`);
      }
    }

    const data: Record<string, unknown> = {};
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.question !== undefined) data.question = dto.question;
    if (dto.answer !== undefined) data.answer = dto.answer;
    if (dto.order !== undefined) data.order = dto.order;

    const item = await this.prisma.faqItem.update({
      where: { id },
      data,
      include: { category: { select: { name: true } } },
    });

    return {
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.category.name,
      question: item.question,
      answer: item.answer,
      order: item.order,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async deleteItem(id: string): Promise<void> {
    const existing = await this.prisma.faqItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`FaqItem #${id} not found`);
    }
    await this.prisma.faqItem.delete({ where: { id } });
  }
}
