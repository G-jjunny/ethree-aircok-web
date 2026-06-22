import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { UpdateMailSettingDto } from './dto/update-mail-setting.dto';
import { UpdateMapSettingDto } from './dto/update-map-setting.dto';
import {
  MAIL_SETTING_ID,
  DEFAULT_SUBJECT_TEMPLATE,
  DEFAULT_BODY_TEMPLATE,
} from './mail-setting.constants';
import { MAP_SETTING_ID, DEFAULT_MAP_ADDRESS } from './map-setting.constants';

@Injectable()
export class InquiryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(dto: CreateInquiryDto) {
    const created = await this.prisma.inquiry.create({
      data: {
        company: dto.company,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        message: dto.message,
      },
    });

    // MailService 가 graceful(미설정/실패 시 throw 안 함)하므로 그대로 호출한다.
    await this.mail.sendInquiryNotification(created);

    return created;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.inquiry.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inquiry.count(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry #${id} not found`);
    }
    return inquiry;
  }

  async update(id: string, dto: UpdateInquiryDto) {
    await this.findOne(id);
    return this.prisma.inquiry.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inquiry.delete({ where: { id } });
  }

  /**
   * 문의 알림 메일 설정(고정 PK 싱글톤) 조회.
   * - upsert 로 id = 'singleton' 행을 조회한다.
   * - 행이 없으면 기본값으로 lazy 생성 후 반환한다(이후 GET/발송에서 자동 존재).
   * - recipientEmail 기본값은 env INQUIRY_RECIPIENT_EMAIL, 없으면 빈 문자열.
   */
  async getMailSetting() {
    return this.prisma.mailSetting.upsert({
      where: { id: MAIL_SETTING_ID },
      update: {},
      create: {
        id: MAIL_SETTING_ID,
        recipientEmail: process.env.INQUIRY_RECIPIENT_EMAIL ?? '',
        subjectTemplate: DEFAULT_SUBJECT_TEMPLATE,
        bodyTemplate: DEFAULT_BODY_TEMPLATE,
      },
    });
  }

  /**
   * 문의 알림 메일 설정(고정 PK 싱글톤) 수정 — upsert.
   * - id = 'singleton' 행이 있으면 update, 없으면 create 한다.
   * - update/create 모두 dto 의 3필드를 사용한다.
   */
  async updateMailSetting(dto: UpdateMailSettingDto) {
    return this.prisma.mailSetting.upsert({
      where: { id: MAIL_SETTING_ID },
      update: {
        recipientEmail: dto.recipientEmail,
        subjectTemplate: dto.subjectTemplate,
        bodyTemplate: dto.bodyTemplate,
      },
      create: {
        id: MAIL_SETTING_ID,
        recipientEmail: dto.recipientEmail,
        subjectTemplate: dto.subjectTemplate,
        bodyTemplate: dto.bodyTemplate,
      },
    });
  }

  /**
   * 문의하기 지도 주소 설정(고정 PK 싱글톤) 조회.
   * - upsert 로 id = 'singleton' 행을 조회한다.
   * - 행이 없으면 기본 주소(DEFAULT_MAP_ADDRESS)로 lazy 생성 후 반환한다.
   * - 공개 엔드포인트(GET /api/inquiry/map-setting)에서 호출된다.
   */
  async getMapSetting() {
    return this.prisma.mapSetting.upsert({
      where: { id: MAP_SETTING_ID },
      update: {},
      create: {
        id: MAP_SETTING_ID,
        address: DEFAULT_MAP_ADDRESS,
      },
    });
  }

  /**
   * 문의하기 지도 주소 설정(고정 PK 싱글톤) 수정 — upsert.
   * - id = 'singleton' 행이 있으면 update, 없으면 create 한다.
   * - update/create 모두 dto 의 address 를 사용한다.
   */
  async updateMapSetting(dto: UpdateMapSettingDto) {
    return this.prisma.mapSetting.upsert({
      where: { id: MAP_SETTING_ID },
      update: {
        address: dto.address,
      },
      create: {
        id: MAP_SETTING_ID,
        address: dto.address,
      },
    });
  }
}
