import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { UpdateMailSettingDto } from './dto/update-mail-setting.dto';
import { UpdateMapSettingDto } from './dto/update-map-setting.dto';
import { CreateInquiryFieldDto } from './dto/create-inquiry-field.dto';
import { UpdateInquiryFieldDto } from './dto/update-inquiry-field.dto';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiryService.create(dto);
  }

  // 정적 경로 'mail-setting' 은 ':id' path-param 라우트보다 위에 두어
  // 라우트 매칭 충돌(모호성)을 명확히 회피한다.
  @UseGuards(JwtAuthGuard)
  @Get('mail-setting')
  getMailSetting() {
    return this.inquiryService.getMailSetting();
  }

  @UseGuards(JwtAuthGuard)
  @Put('mail-setting')
  updateMailSetting(@Body() dto: UpdateMailSettingDto) {
    return this.inquiryService.updateMailSetting(dto);
  }

  // 정적 경로 'map-setting' 도 'mail-setting' 과 동일하게 ':id' path-param
  // 라우트보다 위에 두어 라우트 매칭 충돌(모호성)을 명확히 회피한다.
  //
  // 주의: mail-setting GET 은 어드민 전용이지만, map-setting GET 은 문의하기
  // 페이지가 지도 주소를 노출하기 위한 공개 엔드포인트(인증 불필요)이므로
  // JwtAuthGuard 를 붙이지 않는다. 수정(PUT)만 어드민 전용으로 가드한다.
  @Get('map-setting')
  getMapSetting() {
    return this.inquiryService.getMapSetting();
  }

  @UseGuards(JwtAuthGuard)
  @Put('map-setting')
  updateMapSetting(@Body() dto: UpdateMapSettingDto) {
    return this.inquiryService.updateMapSetting(dto);
  }

  // 정적 경로 'fields' 세그먼트 라우트들도 'mail-setting'/'map-setting' 과 동일하게
  // ':id' path-param 라우트보다 위에 두어 라우트 매칭 충돌(모호성)을 회피한다.
  //
  // 주의: GET 'fields' 는 공개 폼이 필드 구성을 렌더링하기 위한 공개 엔드포인트
  // (인증 불필요)이다. 생성/수정/삭제만 어드민 전용으로 가드한다.
  @Get('fields')
  findAllFields() {
    return this.inquiryService.findAllFields();
  }

  @UseGuards(JwtAuthGuard)
  @Post('fields')
  createField(@Body() dto: CreateInquiryFieldDto) {
    return this.inquiryService.createField(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('fields/:id')
  updateField(@Param('id') id: string, @Body() dto: UpdateInquiryFieldDto) {
    return this.inquiryService.updateField(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('fields/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeField(@Param('id') id: string) {
    return this.inquiryService.removeField(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.inquiryService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.inquiryService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inquiryService.remove(id);
  }
}
