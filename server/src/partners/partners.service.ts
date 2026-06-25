import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ReorderPartnersDto } from './dto/reorder-partners.dto';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.partner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`Partner #${id} not found`);
    }
    return partner;
  }

  async create(dto: CreatePartnerDto) {
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.partner.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.partner.create({
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        type: dto.type,
        order,
      },
    });
  }

  async reorder(dto: ReorderPartnersDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.partner.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async update(id: string, dto: UpdatePartnerDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.logoUrl !== undefined) data.logoUrl = dto.logoUrl;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.partner.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.partner.delete({ where: { id } });
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    await this.findOne(id);
    const logoUrl = `/uploads/${file.filename}`;
    await this.prisma.partner.update({
      where: { id },
      data: { logoUrl },
    });
    return { url: logoUrl };
  }
}
