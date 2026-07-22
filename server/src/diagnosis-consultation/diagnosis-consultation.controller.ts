import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
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
  // 공개 POST 스팸 방지: 분당 5회로 제한(라우트별 스로틀).
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
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
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.diagnosisConsultationService.findAll(page, limit);
  }

  /** GET /api/diagnosis-consultation/:id — JWT 필요. */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagnosisConsultationService.findOne(id);
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
