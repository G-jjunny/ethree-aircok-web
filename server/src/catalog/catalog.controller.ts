import {
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
import { diskStorage } from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CatalogService } from './catalog.service';
import { CreateCatalogImageDto } from './dto/create-catalog-image.dto';
import { UpdateCatalogImageDto } from './dto/update-catalog-image.dto';
import { ReorderCatalogDto } from './dto/reorder-catalog.dto';

const multerOptions = {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', '..', 'public', 'uploads'),
    filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
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
