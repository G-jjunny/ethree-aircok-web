import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatalogImageDto } from './dto/create-catalog-image.dto';
import { UpdateCatalogImageDto } from './dto/update-catalog-image.dto';
import { ReorderCatalogDto } from './dto/reorder-catalog.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.catalogImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const image = await this.prisma.catalogImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`CatalogImage #${id} not found`);
    }
    return image;
  }

  async create(dto: CreateCatalogImageDto) {
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.catalogImage.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.catalogImage.create({
      data: {
        imageUrl: dto.imageUrl,
        order,
      },
    });
  }

  async update(id: string, dto: UpdateCatalogImageDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.catalogImage.update({ where: { id }, data });
  }

  async reorder(dto: ReorderCatalogDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.catalogImage.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.catalogImage.delete({ where: { id } });
  }
}
