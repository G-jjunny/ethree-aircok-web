import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { UpsertSiteInfoDto } from './dto/upsert-site-info.dto';
import { SiteInfoService } from './site-info.service';

@Controller('site-info')
export class SiteInfoController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  /** GET /api/site-info — 공개 엔드포인트. 인증 불필요. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findOrCreate() {
    return this.siteInfoService.findOrCreate();
  }

  /** PUT /api/site-info — 어드민 전용. JWT 인증 필요. */
  @UseGuards(JwtAuthGuard)
  @Put()
  upsert(@Body() dto: UpsertSiteInfoDto) {
    return this.siteInfoService.upsert(dto);
  }
}
