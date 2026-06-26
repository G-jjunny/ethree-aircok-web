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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTimelineItemDto } from './dto/create-timeline-item.dto';
import { UpdateTimelineItemDto } from './dto/update-timeline-item.dto';
import { TimelineService } from './timeline.service';

@Controller('timelines')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  /** GET /api/timelines — 공개 엔드포인트. year DESC, month DESC, createdAt DESC 정렬. */
  @Get()
  findAll() {
    return this.timelineService.findAll();
  }

  /** POST /api/timelines — JWT 인증 필요. 201 Created. */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTimelineItemDto) {
    return this.timelineService.create(dto);
  }

  /** PATCH /api/timelines/:id — JWT 인증 필요. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTimelineItemDto) {
    return this.timelineService.update(id, dto);
  }

  /** DELETE /api/timelines/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.timelineService.remove(id);
  }
}
