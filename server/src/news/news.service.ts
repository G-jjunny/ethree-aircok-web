import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.newsPost.findMany({
        where: { published: true },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          location: true,
          published: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.newsPost.count({ where: { published: true } }),
    ]);

    return { data, total, page, limit };
  }

  async findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.newsPost.findMany({
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          date: true,
          location: true,
          published: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.newsPost.count(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const post = await this.prisma.newsPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`NewsPost #${id} not found`);
    }
    return post;
  }

  async create(dto: CreateNewsDto) {
    return this.prisma.newsPost.create({
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        date: new Date(dto.date),
        location: dto.location,
        published: dto.published ?? false,
        coverImage: dto.coverImage || null,
      },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.date !== undefined) data.date = new Date(dto.date);
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.published !== undefined) data.published = dto.published;
    if (dto.coverImage !== undefined) data.coverImage = dto.coverImage || null;

    return this.prisma.newsPost.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.newsPost.delete({ where: { id } });
  }
}
