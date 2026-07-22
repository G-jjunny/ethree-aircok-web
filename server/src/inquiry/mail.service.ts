import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Inquiry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  MAIL_SETTING_ID,
  DEFAULT_SUBJECT_TEMPLATE,
  DEFAULT_BODY_TEMPLATE,
} from './mail-setting.constants';

/**
 * 문의 접수 알림 메일 발송 서비스 (nodemailer).
 *
 * 수신주소/제목/본문 템플릿은 DB(MailSetting 싱글톤) 우선, 없으면 env/기본 상수로 폴백한다.
 * SMTP 접속 정보(host/port/user/pass) 및 from 은 계속 env 에서 읽는다.
 *
 * graceful 정책:
 * - SMTP_HOST / MAIL_FROM 가 없으면 transporter 를 생성하지 않고, 발송 메서드는
 *   warn 로그만 남긴 뒤 조용히 return 한다. (수신주소는 발송 시점에 DB/env 로 결정하므로
 *   transporter 생성 조건에서 제외한다.)
 * - 수신주소가 DB/env 어디에도 없으면 발송 시점에 warn 후 return 한다.
 * - 발송 시도는 try/catch 로 감싸 실패해도 throw 하지 않고 error 로그만 남긴다.
 * - 즉, 메일 미설정/실패가 문의 접수(POST 응답)를 절대 막지 않는다.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string | undefined;

  constructor(private readonly prisma: PrismaService) {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    this.from = process.env.MAIL_FROM;

    if (!host || !this.from) {
      this.transporter = null;
      this.logger.warn(
        'SMTP 설정(SMTP_HOST/MAIL_FROM)이 없어 메일 발송이 비활성화됩니다. 문의 접수는 정상 동작합니다.',
      );
      return;
    }

    const parsedPort = port ? Number(port) : 587;

    this.transporter = nodemailer.createTransport({
      host,
      port: parsedPort,
      secure: parsedPort === 465,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendInquiryNotification(inquiry: Inquiry): Promise<void> {
    if (!this.transporter || !this.from) {
      this.logger.warn(
        `메일 미발송(SMTP 설정 없음): 문의 #${inquiry.id} 알림을 건너뜁니다.`,
      );
      return;
    }

    // 수신주소/템플릿은 DB(MailSetting 싱글톤) 우선, 없으면 env/기본 상수 폴백.
    const setting = await this.prisma.mailSetting.findUnique({
      where: { id: MAIL_SETTING_ID },
    });

    const recipient =
      setting?.recipientEmail || process.env.INQUIRY_RECIPIENT_EMAIL;
    if (!recipient) {
      this.logger.warn(
        `메일 미발송(수신주소 없음): 문의 #${inquiry.id} 알림을 건너뜁니다.`,
      );
      return;
    }

    const subjectTemplate = setting?.subjectTemplate || DEFAULT_SUBJECT_TEMPLATE;
    const bodyTemplate = setting?.bodyTemplate || DEFAULT_BODY_TEMPLATE;

    // answers(Record<string, string>)의 모든 key 가 템플릿 치환 변수가 된다.
    // Prisma 의 Json 타입은 JsonValue 이므로 객체로 가드 후 값을 문자열로 정규화한다.
    // 기본 5필드 key(company/name/phone/email/message)가 answers 에 있으면
    // 기존 템플릿({{company}} 등)이 그대로 동작한다.
    const answers = (inquiry.answers ?? {}) as Record<string, unknown>;
    const valueMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(answers)) {
      valueMap[key] = value == null ? '' : String(value);
    }

    // subject/text 는 치환값 그대로, html 은 치환되는 동적 값만 escape.
    const subject = renderTemplate(subjectTemplate, valueMap, false);
    const text = renderTemplate(bodyTemplate, valueMap, false);
    const html = `<div style="white-space:pre-wrap;">${renderTemplate(
      bodyTemplate,
      valueMap,
      true,
    )}</div>`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: recipient,
        subject,
        text,
        html,
      });
      this.logger.log(`문의 알림 메일 발송 완료: 문의 #${inquiry.id}`);
    } catch (err) {
      this.logger.error(
        `문의 알림 메일 발송 실패: 문의 #${inquiry.id}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}

/**
 * {{token}} 토큰을 valueMap 값으로 치환한다.
 * - escape=true 면 치환되는 동적 값만 HTML 이스케이프한다(템플릿 정적 텍스트는 그대로).
 * - valueMap 에 없는 토큰은 원본 그대로 둔다.
 */
function renderTemplate(
  template: string,
  valueMap: Record<string, string>,
  escape: boolean,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (!(key in valueMap)) {
      return match;
    }
    const value = valueMap[key];
    return escape ? escapeHtml(value) : value;
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
