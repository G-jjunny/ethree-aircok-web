import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReorderServiceImagesDto } from './dto/reorder-service-image.dto';

@Injectable()
export class ServiceImageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const image = await this.prisma.serviceImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`ServiceImage #${id} not found`);
    }
    return image;
  }

  /**
   * R2 업로드 후 받은 imageUrl 로 레코드를 생성한다.
   * - order 는 맨 뒤 append 정책: 현재 최대 order + 1 (없으면 0).
   */
  async create(imageUrl: string) {
    const last = await this.prisma.serviceImage.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = last ? last.order + 1 : 0;

    return this.prisma.serviceImage.create({
      data: { imageUrl, order },
    });
  }

  async reorder(dto: ReorderServiceImagesDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.serviceImage.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.serviceImage.delete({ where: { id } });
  }
}
