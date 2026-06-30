import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { DiagnosisImageController } from './diagnosis-image.controller';
import { DiagnosisImageService } from './diagnosis-image.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [DiagnosisImageController],
  providers: [DiagnosisImageService],
})
export class DiagnosisImageModule {}
