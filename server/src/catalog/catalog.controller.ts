import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { R2Service } from '../upload/r2.service';
import { CatalogService } from './catalog.service';
import { CreateCatalogImageDto } from './dto/create-catalog-image.dto';
import { UpdateCatalogImageDto } from './dto/update-catalog-image.dto';
import { ReorderCatalogDto } from './dto/reorder-catalog.dto';

// 카탈로그 업로드 허용 MIME 타입 화이트리스트 (#44). 이미지 + PDF.
const ALLOWED_UPLOAD_MIMETYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const multerOptions = {
  // R2 업로드를 위해 메모리 버퍼에만 담는다(로컬 디스크 저장 없음).
  storage: memoryStorage(),
  // 허용 목록 외 mimetype 은 거부한다.
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (ALLOWED_UPLOAD_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('허용되지 않은 파일 형식입니다.'), false);
    }
  },
  // 최대 파일 크기 20MB. 초과 시 거부.
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
};

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/catalog — 공개 엔드포인트. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // PDF 는 'pdf', 그 외 허용 이미지 타입은 'image' 로 분류해 응답한다.
    const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    // R2 로 업로드하고 절대 URL 을 반환한다(로컬 /uploads 경로 미사용).
    const url = await this.r2Service.upload(file, 'catalog');
    return { url, fileType };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCatalogImageDto) {
    return this.catalogService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderCatalogDto) {
    return this.catalogService.reorder(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCatalogImageDto) {
    return this.catalogService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.catalogService.remove(id);
  }
}
