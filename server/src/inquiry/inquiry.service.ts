import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isEmail } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { UpdateMailSettingDto } from './dto/update-mail-setting.dto';
import { UpdateMapSettingDto } from './dto/update-map-setting.dto';
import { CreateInquiryFieldDto } from './dto/create-inquiry-field.dto';
import { UpdateInquiryFieldDto } from './dto/update-inquiry-field.dto';

/** 전화번호 형식: 숫자/공백/+,-,() 만 허용. */
const TEL_PATTERN = /^[0-9+\-()\s]+$/;
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

  /**
   * 문의 접수(공개). 동적 폼 정의(InquiryField)를 기준으로 answers 를 검증/정규화한 뒤
   * Inquiry.answers(JSON)에 저장한다. 고정 컬럼(company/name/...)은 채우지 않는다.
   *
   * 검증 절차:
   * 1. 정의에 없는 key 는 무시(허용목록 필터링). 정의된 key 만 answers 로 구성.
   * 2. 각 값이 문자열이 아니면 400.
   * 3. required 필드 누락/공백이면 400.
   * 4. email/tel 타입은 값이 비어있지 않을 때만 형식 검증.
   */
  async create(dto: CreateInquiryDto) {
    const rawAnswers = dto.answers;
    if (
      rawAnswers === null ||
      typeof rawAnswers !== 'object' ||
      Array.isArray(rawAnswers)
    ) {
      throw new BadRequestException('answers 는 객체여야 합니다.');
    }

    const fields = await this.prisma.inquiryField.findMany({
      orderBy: { order: 'asc' },
    });

    const source = rawAnswers as Record<string, unknown>;
    const answers: Record<string, string> = {};

    for (const field of fields) {
      // 정의된 key 만 추린다(정의에 없는 key 는 무시).
      if (!(field.key in source)) {
        // 미제출 필드는 빈 문자열로 간주하여 required 검증으로 흐른다.
        if (field.required) {
          throw new BadRequestException(
            `'${field.label}'은(는) 필수 항목입니다.`,
          );
        }
        continue;
      }

      const rawValue = source[field.key];
      if (typeof rawValue !== 'string') {
        throw new BadRequestException(
          `필드 '${field.key}' 값은 문자열이어야 합니다.`,
        );
      }

      const value = rawValue;
      const trimmed = value.trim();

      if (field.required && trimmed === '') {
        throw new BadRequestException(`'${field.label}'은(는) 필수 항목입니다.`);
      }

      if (trimmed !== '') {
        if (field.type === 'email' && !isEmail(trimmed)) {
          throw new BadRequestException(
            `'${field.label}' 형식이 올바르지 않습니다.`,
          );
        }
        if (field.type === 'tel' && !TEL_PATTERN.test(trimmed)) {
          throw new BadRequestException(
            `'${field.label}' 형식이 올바르지 않습니다.`,
          );
        }
      }

      answers[field.key] = value;
    }

    const created = await this.prisma.inquiry.create({
      data: { answers },
    });

    // MailService 가 graceful(미설정/실패 시 throw 안 함)하므로 그대로 호출한다.
    await this.mail.sendInquiryNotification(created);

    return created;
  }

  // ===== 동적 폼 필드(InquiryField) CRUD (#33) =====

  /** 폼 필드 목록 조회(공개). order 오름차순. */
  async findAllFields() {
    return this.prisma.inquiryField.findMany({
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 폼 필드 생성(어드민). key 중복 시 409.
   * order 미지정 시 max(order)+1 로 마지막에 배치한다.
   */
  async createField(dto: CreateInquiryFieldDto) {
    const existing = await this.prisma.inquiryField.findUnique({
      where: { key: dto.key },
    });
    if (existing) {
      throw new ConflictException(`이미 존재하는 key 입니다: ${dto.key}`);
    }

    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.inquiryField.findFirst({
        orderBy: { order: 'desc' },
      });
      order = last ? last.order + 1 : 0;
    }

    return this.prisma.inquiryField.create({
      data: {
        key: dto.key,
        label: dto.label,
        type: dto.type,
        required: dto.required,
        placeholder: dto.placeholder,
        order,
      },
    });
  }

  /** 폼 필드 수정(어드민). 없으면 404. key 는 변경 불가(DTO 에 미포함). */
  async updateField(id: string, dto: UpdateInquiryFieldDto) {
    const existing = await this.prisma.inquiryField.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`InquiryField #${id} not found`);
    }

    return this.prisma.inquiryField.update({
      where: { id },
      data: {
        label: dto.label,
        type: dto.type,
        required: dto.required,
        placeholder: dto.placeholder,
        order: dto.order,
      },
    });
  }

  /** 폼 필드 삭제(어드민). 없으면 404. */
  async removeField(id: string) {
    const existing = await this.prisma.inquiryField.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`InquiryField #${id} not found`);
    }

    return this.prisma.inquiryField.delete({ where: { id } });
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
