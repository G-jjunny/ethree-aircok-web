import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

/** 진단 상담 정보 업데이트 요청 바디 (어드민 전용). */
export class UpdateDiagnosisConsultationDto {
  /** 상담 상태. NEW | IN_PROGRESS | DONE */
  @IsOptional()
  @IsIn(['NEW', 'IN_PROGRESS', 'DONE'], {
    message: 'status는 NEW, IN_PROGRESS, DONE 중 하나여야 합니다.',
  })
  status?: 'NEW' | 'IN_PROGRESS' | 'DONE';

  /** 상담 예정/완료 일시 (ISO 8601). */
  @IsOptional()
  @IsDateString({}, { message: 'consultationDate는 ISO 8601 형식이어야 합니다.' })
  consultationDate?: string;

  /** 담당 상담사 이름. */
  @IsOptional()
  @IsString()
  consultant?: string;

  /** 상담 메모. */
  @IsOptional()
  @IsString()
  notes?: string;
}
