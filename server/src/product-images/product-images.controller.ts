import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductImageSlot } from '@prisma/client';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { R2Service } from '../upload/r2.service';
import { ProductImagesService } from './product-images.service';

// 섹션 이미지 업로드 허용 MIME 타입 화이트리스트 (#services 1단계). 이미지 전용.
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

@Controller('product-images')
export class ProductImagesController {
  constructor(
    private readonly productImagesService: ProductImagesService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/product-images — 공개 엔드포인트. 등록된 슬롯 전체 배열. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.productImagesService.findAll();
  }

  /**
   * GET /api/product-images/admin — JWT 인증 필요. 어드민 전용, 무캐시.
   *
   * 응답 스키마는 공개 GET 과 완전히 동일하다(필터 차이 없음). 별도 엔드포인트를 두는 목적은
   * **HTTP 캐시 회피**다: 공개 GET 은 CacheControlInterceptor(60) 로 60초 캐시되므로
   * 어드민이 업로드/삭제 직후 목록을 다시 불러오면 갱신 전 응답을 볼 수 있다.
   * 여기서는 CacheControlInterceptor 대신 @Header 로 무캐시를 명시해 항상 최신 상태를 보장한다.
   *
   * 주의: 반드시 PUT/DELETE /:slot 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'admin' 을 :slot 으로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('Pragma', 'no-cache')
  findAllAdmin() {
    return this.productImagesService.findAllAdmin();
  }

  /**
   * PUT /api/product-images/:slot — JWT 인증 필요.
   * multipart(필드명 file) 업로드 → R2(folder: product-sections) → slot 기준 upsert.
   * :slot 은 ProductImageSlot enum 값만 허용하며, 위반 시 ParseEnumPipe 가 400 을 반환한다.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':slot')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upsert(
    @Param('slot', new ParseEnumPipe(ProductImageSlot)) slot: ProductImageSlot,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다.');
    }
    const url = await this.r2Service.upload(file, 'product-sections');
    return this.productImagesService.upsert(slot, url);
  }

  /**
   * DELETE /api/product-images/:slot — JWT 인증 필요. 204 No Content.
   * 미등록 슬롯이어도 204 — 멱등하다(PUT upsert 와 대칭). 상세 근거는 서비스 remove() 주석 참고.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':slot')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('slot', new ParseEnumPipe(ProductImageSlot)) slot: ProductImageSlot,
  ) {
    return this.productImagesService.remove(slot);
  }
}
