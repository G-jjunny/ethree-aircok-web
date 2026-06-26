import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';

@Injectable()
export class TimelineService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.timelineItem.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.timelineItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`TimelineItem #${id} not found`);
    }
    return item;
  }

  async create(dto: CreateTimelineItemDto) {
    return this.prisma.timelineItem.create({
      data: {
        year: dto.year,
        month: dto.month,
        content: dto.content,
      },
    });
  }

  async update(id: string, dto: UpdateTimelineItemDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.year !== undefined) data.year = dto.year;
    if (dto.month !== undefined) data.month = dto.month;
    if (dto.content !== undefined) data.content = dto.content;

    return this.prisma.timelineItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.timelineItem.delete({ where: { id } });
  }
}
