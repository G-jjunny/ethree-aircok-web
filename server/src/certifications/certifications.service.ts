import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReorderCertificationsDto } from './dto/reorder-certifications.dto';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 공개 목록 — order ASC, createdAt ASC(보조) 정렬. */
  async findAll() {
    return this.prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * 어드민 목록 — order ASC, createdAt ASC(보조) 정렬.
   * certification 은 미공개 개념이 없어 findAll 과 동일 쿼리이나, 명시성을 위해 별도 메서드로 둔다.
   */
  async findAllAdmin() {
    return this.prisma.certification.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const cert = await this.prisma.certification.findUnique({
      where: { id },
    });
    if (!cert) {
      throw new NotFoundException(`Certification #${id} not found`);
    }
    return cert;
  }

  /**
   * R2 업로드 후 받은 imageUrl 로 레코드를 생성한다.
   * - order 는 맨 뒤 append 정책: 현재 최대 order + 1 (없으면 0).
   */
  async create(imageUrl: string) {
    const last = await this.prisma.certification.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const order = last ? last.order + 1 : 0;

    return this.prisma.certification.create({
      data: { imageUrl, order },
    });
  }

  async reorder(dto: ReorderCertificationsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.certification.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAll();
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.certification.delete({ where: { id } });
  }
}
