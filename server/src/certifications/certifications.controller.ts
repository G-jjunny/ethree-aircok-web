import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { R2Service } from '../upload/r2.service';
import { ReorderCertificationsDto } from './dto/reorder-certifications.dto';
import { CertificationsService } from './certifications.service';

// 특허증·성능인증서 이미지 업로드 허용 MIME 타입 화이트리스트 (#124). 이미지 전용.
const ALLOWED_IMAGE_MIMETYPES = [
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
    if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
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

@Controller('certifications')
export class CertificationsController {
  constructor(
    private readonly certificationsService: CertificationsService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/certifications — 공개 엔드포인트. order ASC, createdAt ASC 정렬. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.certificationsService.findAll();
  }

  /**
   * GET /api/certifications/admin — JWT 인증 필요. 무캐시.
   * certification 은 미공개 개념이 없어 공개 GET 과 응답이 동일하나,
   * 어드민이 업로드/삭제 직후 캐시된 구 응답을 보는 것을 막기 위해 no-store 로 분리한다.
   * 주의: 반드시 :id 파라미터 라우트보다 먼저 선언해야 한다.
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  findAllAdmin() {
    return this.certificationsService.findAllAdmin();
  }

  /**
   * POST /api/certifications — JWT 인증 필요. 201 Created.
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
    const url = await this.r2Service.upload(file, 'certifications');
    return this.certificationsService.create(url);
  }

  /**
   * PATCH /api/certifications/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderCertificationsDto) {
    return this.certificationsService.reorder(dto);
  }

  /** DELETE /api/certifications/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.certificationsService.remove(id);
  }
}
