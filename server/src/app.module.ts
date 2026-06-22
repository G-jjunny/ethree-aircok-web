import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { InquiryModule } from './inquiry/inquiry.module';

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
  ],
})
export class AppModule {}
