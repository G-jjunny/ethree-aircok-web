import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CacheControlInterceptor } from '../common/interceptors/http-cache.interceptor';
import { CreateCoreValueDto } from './dto/create-core-value.dto';
import { UpdateCoreValueDto } from './dto/update-core-value.dto';
import { ReorderCoreValuesDto } from './dto/reorder-core-values.dto';
import { CoreValuesService } from './core-values.service';

@Controller('core-values')
export class CoreValuesController {
  constructor(private readonly coreValuesService: CoreValuesService) {}

  /** GET /api/core-values — 공개 엔드포인트. order ASC, createdAt ASC 정렬. */
  @UseInterceptors(new CacheControlInterceptor(60))
  @Get()
  findAll() {
    return this.coreValuesService.findAll();
  }

  /** POST /api/core-values — JWT 인증 필요. 201 Created. */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCoreValueDto) {
    return this.coreValuesService.create(dto);
  }

  /**
   * PATCH /api/core-values/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderCoreValuesDto) {
    return this.coreValuesService.reorder(dto);
  }

  /** PATCH /api/core-values/:id — JWT 인증 필요. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCoreValueDto) {
    return this.coreValuesService.update(id, dto);
  }

  /** DELETE /api/core-values/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.coreValuesService.remove(id);
  }
}
