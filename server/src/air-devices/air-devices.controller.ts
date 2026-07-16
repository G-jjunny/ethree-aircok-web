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
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { R2Service } from '../upload/r2.service';
import { AirDevicesService } from './air-devices.service';
import { CreateAirDeviceDto } from './dto/create-air-device.dto';
import { ReorderAirDevicesDto } from './dto/reorder-air-devices.dto';
import { UpdateAirDeviceDto } from './dto/update-air-device.dto';

// 측정기 제품 사진 업로드 허용 MIME 타입 화이트리스트 (#services 1단계). 이미지 전용.
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

@Controller('air-devices')
export class AirDevicesController {
  constructor(
    private readonly airDevicesService: AirDevicesService,
    private readonly r2Service: R2Service,
  ) {}

  /** GET /api/air-devices — 공개 엔드포인트. published=true 만, order ASC. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.airDevicesService.findAll();
  }

  /**
   * GET /api/air-devices/admin — JWT 인증 필요. 미공개 포함 전체.
   * 주의: 반드시 GET /:id 보다 먼저 선언해야 한다(현재 :id 단건 GET 은 없으나 컨벤션 유지).
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.airDevicesService.findAllAdmin();
  }

  /** POST /api/air-devices — JWT 인증 필요. 201 Created. items 중첩 생성. */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAirDeviceDto) {
    return this.airDevicesService.create(dto);
  }

  /**
   * PATCH /api/air-devices/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderAirDevicesDto) {
    return this.airDevicesService.reorder(dto);
  }

  /** PATCH /api/air-devices/:id — JWT 인증 필요. items 전달 시 replace-all. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAirDeviceDto) {
    return this.airDevicesService.update(id, dto);
  }

  /** DELETE /api/air-devices/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.airDevicesService.remove(id);
  }

  /** POST /api/air-devices/:id/image — JWT 인증 필요. 제품 사진 R2 업로드. */
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
    const url = await this.r2Service.upload(file, 'air-devices');
    return this.airDevicesService.uploadImage(id, url);
  }
}
