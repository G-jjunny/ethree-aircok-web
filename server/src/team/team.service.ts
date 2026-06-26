import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamImageDto } from './dto/create-team-image.dto';
import { UpdateTeamImageDto } from './dto/update-team-image.dto';
import { ReorderTeamImagesDto } from './dto/reorder-team-images.dto';

/** OUR Team 이미지 최대 등록 개수 (#57). 서비스 레이어에서 강제. */
const MAX_TEAM_IMAGES = 3;

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

  async create(dto: CreateTeamImageDto) {
    // 최대 3개 제한 강제. 이미 3개면 생성 거부(400).
    const count = await this.prisma.teamImage.count();
    if (count >= MAX_TEAM_IMAGES) {
      throw new BadRequestException(
        '팀 이미지는 최대 3개까지만 등록할 수 있습니다.',
      );
    }

    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.teamImage.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.teamImage.create({
      data: {
        imageUrl: dto.imageUrl,
        order,
      },
    });
  }

  async update(id: string, dto: UpdateTeamImageDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.order !== undefined) data.order = dto.order;

    return this.prisma.teamImage.update({ where: { id }, data });
  }

  async reorder(dto: ReorderTeamImagesDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.teamImage.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teamImage.delete({ where: { id } });
  }
}
