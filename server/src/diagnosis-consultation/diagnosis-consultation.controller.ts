import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DiagnosisConsultationService } from './diagnosis-consultation.service';
import { CreateDiagnosisConsultationDto } from './dto/create-diagnosis-consultation.dto';
import { UpdateDiagnosisConsultationDto } from './dto/update-diagnosis-consultation.dto';

@Controller('diagnosis-consultation')
export class DiagnosisConsultationController {
  constructor(
    private readonly diagnosisConsultationService: DiagnosisConsultationService,
  ) {}

  /** POST /api/diagnosis-consultation — 공개 (인증 불필요). */
  @Post()
  create(@Body() dto: CreateDiagnosisConsultationDto) {
    return this.diagnosisConsultationService.create(dto);
  }

  /**
   * GET /api/diagnosis-consultation/new-count — JWT 필요.
   * 정적 경로를 ':id' path-param 라우트보다 위에 두어 라우트 매칭 충돌을 회피한다.
   */
  @UseGuards(JwtAuthGuard)
  @Get('new-count')
  findNewCount() {
    return this.diagnosisConsultationService.findNewCount();
  }

  /** GET /api/diagnosis-consultation — JWT 필요. */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.diagnosisConsultationService.findAll();
  }

  /** PATCH /api/diagnosis-consultation/:id — JWT 필요. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDiagnosisConsultationDto,
  ) {
    return this.diagnosisConsultationService.update(id, dto);
  }
}
