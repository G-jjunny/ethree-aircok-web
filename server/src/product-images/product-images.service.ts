import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductImageSlot } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductImagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 등록된 슬롯 행 전체를 배열로 반환한다(미등록 슬롯은 응답에 없음).
   *
   * 이 모델에는 order 컬럼이 없다(순서는 프론트 레이아웃이 결정). 응답 순서 안정성만
   * 확보하면 되므로 createdAt 오름차순으로 정렬한다.
   */
  async findAll() {
    return this.prisma.productSectionImage.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * slot 기준 upsert — 있으면 imageUrl 교체, 없으면 생성.
   * slot 에 @unique 가 걸려 있어 슬롯당 1행이 DB 레벨에서 보장된다 → 멱등한 PUT 시맨틱.
   */
  async upsert(slot: ProductImageSlot, imageUrl: string) {
    return this.prisma.productSectionImage.upsert({
      where: { slot },
      update: { imageUrl },
      create: { slot, imageUrl },
    });
  }

  /**
   * 슬롯 행 삭제.
   *
   * 미등록 슬롯은 NotFoundException(404). 기존 모든 모듈의 remove() 가
   * "존재 확인 후 없으면 404" 패턴이라 이를 따른다(멱등 204 대신).
   */
  async remove(slot: ProductImageSlot) {
    const existing = await this.prisma.productSectionImage.findUnique({
      where: { slot },
    });
    if (!existing) {
      throw new NotFoundException(`ProductSectionImage slot ${slot} not found`);
    }
    return this.prisma.productSectionImage.delete({ where: { slot } });
  }
}
