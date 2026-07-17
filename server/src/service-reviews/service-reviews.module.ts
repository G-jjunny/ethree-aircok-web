import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';
import { ServiceReviewsController } from './service-reviews.controller';
import { ServiceReviewsService } from './service-reviews.service';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ServiceReviewsController],
  providers: [ServiceReviewsService],
})
export class ServiceReviewsModule {}
