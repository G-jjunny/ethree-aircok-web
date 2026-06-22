import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

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
}
