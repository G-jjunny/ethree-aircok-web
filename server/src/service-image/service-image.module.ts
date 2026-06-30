import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { ServiceImageController } from './service-image.controller';
import { ServiceImageService } from './service-image.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ServiceImageController],
  providers: [ServiceImageService],
})
export class ServiceImageModule {}
