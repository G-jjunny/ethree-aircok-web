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
import { DiagnosisConsultationModule } from './diagnosis-consultation/diagnosis-consultation.module';
import { CoreValuesModule } from './core-values/core-values.module';
import { AirDevicesModule } from './air-devices/air-devices.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ServiceReviewsModule } from './service-reviews/service-reviews.module';
import { CertificationsModule } from './certifications/certifications.module';

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
    DiagnosisConsultationModule,
    CoreValuesModule,
    AirDevicesModule,
    ProductImagesModule,
    ServiceReviewsModule,
    CertificationsModule,
  ],
})
export class AppModule {}
