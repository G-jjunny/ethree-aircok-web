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
