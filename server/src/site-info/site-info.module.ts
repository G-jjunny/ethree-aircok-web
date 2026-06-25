import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SiteInfoController } from './site-info.controller';
import { SiteInfoService } from './site-info.service';

@Module({
  imports: [PrismaModule],
  controllers: [SiteInfoController],
  providers: [SiteInfoService],
})
export class SiteInfoModule {}
