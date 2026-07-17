import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { ReorderServiceReviewsDto } from './dto/reorder-service-reviews.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';

@Injectable()
export class ServiceReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 공개 목록 — published=true 만. order ASC, createdAt ASC(보조). */
  async findAll() {
    return this.prisma.serviceReview.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /** 어드민 목록 — 미공개(published=false) 포함 전체. */
  async findAllAdmin() {
    return this.prisma.serviceReview.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.serviceReview.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`ServiceReview #${id} not found`);
    }
    return review;
  }

  /**
   * 레코드 생성.
   * - order 미지정 시 맨 뒤 append: 현재 최대 order + 1 (없으면 0).
   * - published 미지정 시 Prisma 기본값(true) 적용을 위해 키 자체를 넘기지 않는다.
   * - imageUrl 은 여기서 받지 않는다(아바타는 생성 후 POST /:id/image 로 업로드).
   */
  async create(dto: CreateServiceReviewDto) {
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.serviceReview.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.serviceReview.create({
      data: {
        quote: dto.quote,
        role: dto.role,
        age: dto.age,
        order,
        ...(dto.published !== undefined ? { published: dto.published } : {}),
      },
    });
  }

  /**
   * 드래그앤드롭 일괄 순서변경.
   *
   * 응답은 **어드민 전체 배열**(미공개 포함)이다. 공개 findAll()(published=true 만)을
   * 반환하면 어드민 화면에서 미공개 카드가 사라진다(air-devices 패턴).
   */
  async reorder(dto: ReorderServiceReviewsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.serviceReview.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAllAdmin();
  }

  /** 부분 수정. 전달된 필드만 갱신한다. */
  async update(id: string, dto: UpdateServiceReviewDto) {
    await this.findOne(id);

    const data: Prisma.ServiceReviewUpdateInput = {};
    if (dto.quote !== undefined) data.quote = dto.quote;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.age !== undefined) data.age = dto.age;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.published !== undefined) data.published = dto.published;

    return this.prisma.serviceReview.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.serviceReview.delete({ where: { id } });
  }

  /** R2 업로드 후 받은 URL 로 아바타 이미지를 갱신한다(air-devices 로고 패턴). */
  async uploadImage(id: string, imageUrl: string) {
    await this.findOne(id);
    return this.prisma.serviceReview.update({
      where: { id },
      data: { imageUrl },
    });
  }
}
