import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSiteInfoDto } from './dto/upsert-site-info.dto';

@Injectable()
export class SiteInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET 핸들러에서 호출.
   * 성능상 매 요청마다 쓰기(upsert)하지 않도록 findUnique 로 순수 읽기를 먼저 수행한다.
   * 행이 없을 때만 id='singleton' 빈 행을 lazy 생성한다.
   * 실제 스키마는 companyName 등이 NOT NULL이므로 첫 생성 시
   * 빈 문자열로 초기화한다.
   */
  async findOrCreate() {
    const existing = await this.prisma.siteInfo.findUnique({
      where: { id: 'singleton' },
    });
    if (existing) {
      return existing;
    }

    return this.prisma.siteInfo.create({
      data: {
        id: 'singleton',
        companyName: '',
        address: '',
        phone: '',
        email: '',
        bizNo: '',
        ceo: '',
      },
    });
  }

  /**
   * PUT 핸들러에서 호출.
   * id='singleton' 행을 upsert(없으면 생성, 있으면 dto 필드 갱신).
   */
  async upsert(dto: UpsertSiteInfoDto) {
    const data: Record<string, unknown> = {};
    if (dto.companyName !== undefined) data.companyName = dto.companyName;
    if (dto.legalName !== undefined) data.legalName = dto.legalName;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.bizNo !== undefined) data.bizNo = dto.bizNo;
    if (dto.ceo !== undefined) data.ceo = dto.ceo;
    if (dto.fax !== undefined) data.fax = dto.fax;
    if (dto.mailOrderNo !== undefined) data.mailOrderNo = dto.mailOrderNo;
    if (dto.instagram !== undefined) data.instagram = dto.instagram;
    if (dto.youtube !== undefined) data.youtube = dto.youtube;
    if (dto.linkedin !== undefined) data.linkedin = dto.linkedin;
    if (dto.facebook !== undefined) data.facebook = dto.facebook;
    if (dto.kakaoUrl !== undefined) data.kakaoUrl = dto.kakaoUrl;

    return this.prisma.siteInfo.upsert({
      where: { id: 'singleton' },
      create: {
        id: 'singleton',
        companyName: dto.companyName,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        bizNo: dto.bizNo,
        ceo: dto.ceo,
        ...data,
      },
      update: data,
    });
  }
}
