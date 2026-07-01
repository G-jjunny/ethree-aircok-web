import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiagnosisConsultationDto } from './dto/create-diagnosis-consultation.dto';
import { UpdateDiagnosisConsultationDto } from './dto/update-diagnosis-consultation.dto';

@Injectable()
export class DiagnosisConsultationService {
  constructor(private readonly prisma: PrismaService) {}

  /** 진단 상담 신청 생성 (공개). */
  async create(dto: CreateDiagnosisConsultationDto) {
    return this.prisma.diagnosisConsultation.create({
      data: {
        name: dto.name,
        phone: dto.phone,
      },
    });
  }

  /** 전체 목록 조회 (어드민, createdAt DESC). */
  async findAll() {
    return this.prisma.diagnosisConsultation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /** status = "NEW" 건수 반환 (어드민). */
  async findNewCount() {
    const count = await this.prisma.diagnosisConsultation.count({
      where: { status: 'NEW' },
    });
    return { count };
  }

  /** 상태/상담 정보 업데이트 (어드민). 없으면 404. */
  async update(id: string, dto: UpdateDiagnosisConsultationDto) {
    const existing = await this.prisma.diagnosisConsultation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`DiagnosisConsultation #${id} not found`);
    }

    return this.prisma.diagnosisConsultation.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.consultationDate !== undefined && {
          consultationDate: new Date(dto.consultationDate),
        }),
        ...(dto.consultant !== undefined && { consultant: dto.consultant }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }
}
