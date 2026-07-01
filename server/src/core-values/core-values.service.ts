import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoreValueDto } from './dto/create-core-value.dto';
import { UpdateCoreValueDto } from './dto/update-core-value.dto';
import { ReorderCoreValuesDto } from './dto/reorder-core-values.dto';

@Injectable()
export class CoreValuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coreValue.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const coreValue = await this.prisma.coreValue.findUnique({
      where: { id },
    });
    if (!coreValue) {
      throw new NotFoundException(`CoreValue #${id} not found`);
    }
    return coreValue;
  }

  async create(dto: CreateCoreValueDto) {
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.coreValue.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.coreValue.create({
      data: {
        title: dto.title,
        description: dto.description,
        order,
      },
    });
  }

  async reorder(dto: ReorderCoreValuesDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.coreValue.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async update(id: string, dto: UpdateCoreValueDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.coreValue.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coreValue.delete({ where: { id } });
  }
}
