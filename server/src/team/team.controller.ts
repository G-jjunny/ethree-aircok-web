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
import { diskStorage } from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamService } from './team.service';
import { CreateTeamImageDto } from './dto/create-team-image.dto';
import { UpdateTeamImageDto } from './dto/update-team-image.dto';
import { ReorderTeamImagesDto } from './dto/reorder-team-images.dto';

// OUR Team 이미지 업로드 허용 MIME 타입 화이트리스트 (#57). 이미지 전용.
const ALLOWED_IMAGE_MIMETYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const multerOptions = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', '..', 'public', 'uploads'),
    filename: (
      _req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
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

@Controller('team-images')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /** GET /api/team-images — 공개 엔드포인트. order ASC, createdAt ASC 정렬. */
  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  /** POST /api/team-images/uploads — JWT 인증 필요. 이미지 업로드 후 { url } 반환. */
  @UseGuards(JwtAuthGuard)
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }

  /** POST /api/team-images — JWT 인증 필요. 201 Created. */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTeamImageDto) {
    return this.teamService.create(dto);
  }

  /**
   * PATCH /api/team-images/reorder — JWT 인증 필요.
   * 주의: 반드시 PATCH /:id 보다 먼저 선언해야 한다.
   * 그렇지 않으면 NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
   */
  @UseGuards(JwtAuthGuard)
  @Patch('reorder')
  reorder(@Body() dto: ReorderTeamImagesDto) {
    return this.teamService.reorder(dto);
  }

  /** PATCH /api/team-images/:id — JWT 인증 필요. */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamImageDto) {
    return this.teamService.update(id, dto);
  }

  /** DELETE /api/team-images/:id — JWT 인증 필요. 204 No Content. */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
