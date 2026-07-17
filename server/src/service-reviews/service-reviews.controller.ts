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
import { ServiceReviewsService } from './service-reviews.service';
import { CreateServiceReviewDto } from './dto/create-service-review.dto';
import { ReorderServiceReviewsDto } from './dto/reorder-service-reviews.dto';
import { UpdateServiceReviewDto } from './dto/update-service-review.dto';

// 후기 아바타 업로드 허용 MIME 타입 화이트리스트 (#124). 이미지 전용.
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

@Controller('service-reviews')
export class ServiceReviewsController {
  constructor(
    private readonly serviceReviewsService: ServiceReviewsService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/service-reviews — 공개 엔드포인트. published=true 만, order ASC. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.serviceReviewsService.findAll();
  }

  /**
   * GET /api/service-reviews/admin — JWT 인증 필요. 미공개 포함 전체, 무캐시.
   * 주의: 반드시 GET /:id 보다 먼저 선언해야 한다(현재 :id 단건 GET 은 없으나 컨벤션 유지).
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('Pragma', 'no-cache')
  findAllAdmin() {
    return this.serviceReviewsService.findAllAdmin();
  }

  /**
   * POST /api/service-reviews — JWT 인증 필요. 201 Created.
   * JSON body(quote/role/age/order?/published?). imageUrl 은 받지 않는다
   * (아바타는 생성 후 POST /:id/image 로 업로드 — forbidNonWhitelisted 로 imageUrl 전송 시 400).
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateServiceReviewDto) {
    return this.serviceReviewsService.create(dto);
  }

  /**
   * PATCH /api/service-reviews/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderServiceReviewsDto) {
    return this.serviceReviewsService.reorder(dto);
  }

  /** PATCH /api/service-reviews/:id — JWT 인증 필요. 부분 수정. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceReviewDto) {
    return this.serviceReviewsService.update(id, dto);
  }

  /** DELETE /api/service-reviews/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.serviceReviewsService.remove(id);
  }

  /** POST /api/service-reviews/:id/image — JWT 인증 필요. 아바타 R2 업로드. */
  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }
    const url = await this.r2Service.upload(file, 'service-reviews');
    return this.serviceReviewsService.uploadImage(id, url);
  }
}
