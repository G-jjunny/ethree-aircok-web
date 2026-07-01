import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { FaqModule } from './faq/faq.module';
import { CatalogModule } from './catalog/catalog.module';
import { SiteInfoModule } from './site-info/site-info.module';
import { PartnersModule } from './partners/partners.module';
import { TeamModule } from './team/team.module';
import { TimelineModule } from './timeline/timeline.module';
import { ServiceImageModule } from './service-image/service-image.module';
import { DiagnosisImageModule } from './diagnosis-image/diagnosis-image.module';
import { DiagnosisConsultationModule } from './diagnosis-consultation/diagnosis-consultation.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    PrismaModule,
    AuthModule,
    NewsModule,
    InquiryModule,
    FaqModule,
    CatalogModule,
    SiteInfoModule,
    PartnersModule,
    TeamModule,
    TimelineModule,
    ServiceImageModule,
    DiagnosisImageModule,
    DiagnosisConsultationModule,
  ],
})
export class AppModule {}
