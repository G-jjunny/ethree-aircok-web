import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { Inquiry } from '@prisma/client';

/**
 * 문의 접수 알림 메일 발송 서비스 (nodemailer).
 *
 * graceful 정책:
 * - SMTP_HOST / INQUIRY_RECIPIENT_EMAIL 등 필수 env 가 없으면 transporter 를
 *   생성하지 않고, 발송 메서드는 warn 로그만 남긴 뒤 조용히 return 한다.
 * - 발송 시도는 try/catch 로 감싸 실패해도 throw 하지 않고 error 로그만 남긴다.
 * - 즉, 메일 미설정/실패가 문의 접수(POST 응답)를 절대 막지 않는다.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string | undefined;
  private readonly recipient: string | undefined;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    this.from = process.env.MAIL_FROM;
    this.recipient = process.env.INQUIRY_RECIPIENT_EMAIL;

    if (!host || !this.from || !this.recipient) {
      this.transporter = null;
      this.logger.warn(
        'SMTP 설정(SMTP_HOST/MAIL_FROM/INQUIRY_RECIPIENT_EMAIL)이 없어 메일 발송이 비활성화됩니다. 문의 접수는 정상 동작합니다.',
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
    if (!this.transporter || !this.from || !this.recipient) {
      this.logger.warn(
        `메일 미발송(설정 없음): 문의 #${inquiry.id} 알림을 건너뜁니다.`,
      );
      return;
    }

    const subject = '[스마트에어콕] 새 문의가 접수되었습니다';

    const lines = [
      '새 문의가 접수되었습니다.',
      '',
      `회사/기관명: ${inquiry.company}`,
      `담당자명: ${inquiry.name}`,
      `전화: ${inquiry.phone}`,
      `이메일: ${inquiry.email}`,
      '',
      '요청사항:',
      inquiry.message,
    ];
    const text = lines.join('\n');

    const html = `
      <h2>새 문의가 접수되었습니다</h2>
      <table cellpadding="6" style="border-collapse:collapse;">
        <tr><td><strong>회사/기관명</strong></td><td>${escapeHtml(inquiry.company)}</td></tr>
        <tr><td><strong>담당자명</strong></td><td>${escapeHtml(inquiry.name)}</td></tr>
        <tr><td><strong>전화</strong></td><td>${escapeHtml(inquiry.phone)}</td></tr>
        <tr><td><strong>이메일</strong></td><td>${escapeHtml(inquiry.email)}</td></tr>
      </table>
      <h3>요청사항</h3>
      <p style="white-space:pre-wrap;">${escapeHtml(inquiry.message)}</p>
    `;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: this.recipient,
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
