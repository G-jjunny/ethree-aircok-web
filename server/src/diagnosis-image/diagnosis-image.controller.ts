import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReorderDiagnosisImagesDto } from './dto/reorder-diagnosis-image.dto';
import { DiagnosisImageService } from './diagnosis-image.service';
import { R2Service } from '../upload/r2.service';

// 진단 이미지 업로드 허용 MIME 타입 화이트리스트 (#83). 이미지 전용.
const ALLOWED_LOGO_MIMETYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const multerOptions = {
  storage: memoryStorage(),
  // 허용 목록 외 mimetype 은 거부한다.
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (ALLOWED_LOGO_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('허용되지 않은 파일 형식입니다.'), false);
    }
  },
  // 최대 파일 크기 5MB. 초과 시 거부.
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

@Controller('diagnosis-images')
export class DiagnosisImageController {
  constructor(
    private readonly diagnosisImageService: DiagnosisImageService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/diagnosis-images — 공개 엔드포인트. order ASC, createdAt ASC 정렬. */
  @Get()
  findAll() {
    return this.diagnosisImageService.findAll();
  }

  /**
   * POST /api/diagnosis-images — JWT 인증 필요. 201 Created.
   * 단일 multipart 업로드(필드명 file) + 레코드 생성.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }
    const url = await this.r2Service.upload(file, 'diagnosis-images');
    return this.diagnosisImageService.create(url);
  }

  /**
   * PATCH /api/diagnosis-images/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderDiagnosisImagesDto) {
    return this.diagnosisImageService.reorder(dto);
  }

  /** DELETE /api/diagnosis-images/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.diagnosisImageService.remove(id);
  }
}
