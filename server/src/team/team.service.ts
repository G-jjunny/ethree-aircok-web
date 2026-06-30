import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamImageDto } from './dto/create-team-image.dto';
import { UpdateTeamImageDto } from './dto/update-team-image.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.teamImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const image = await this.prisma.teamImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`TeamImage #${id} not found`);
    }
    return image;
  }

  /**
   * 단일 이미지 replace 방식.
   * - 기존 레코드 전체를 삭제한 뒤 새 레코드를 생성해 고아 레코드를 방지한다.
   */
  async create(dto: CreateTeamImageDto) {
    return this.prisma.$transaction(async (tx) => {
      await tx.teamImage.deleteMany(); // 기존 전체 삭제
      return tx.teamImage.create({
        data: { imageUrl: dto.imageUrl, order: 0 },
      });
    });
  }

  async update(id: string, dto: UpdateTeamImageDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    return this.prisma.teamImage.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamImage.delete({ where: { id } });
  }
}
