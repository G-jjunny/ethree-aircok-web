import 'dotenv/config';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 프론트엔드는 Next.js rewrite 프록시(동일 출처)로 API 를 호출하므로 프로덕션에서
  // CORS 는 사실상 불필요하다. 다만 별도 출처에서 직접 호출해야 하는 경우를 위해
  // CORS_ORIGIN(콤마 구분 복수 허용) 을 지원하고, 미설정 시 로컬 개발 기본값을 유지한다.
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : 'http://localhost:3000';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // 레거시 정적 업로드(/uploads/*) 하위호환.
  // R2 이관(npm run migrate:catalog-team-to-r2) 전/실패 시 기존 레코드가 깨지지 않도록 유지한다.
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));

  // Render 등 PaaS 는 PORT 를 주입하며, 컨테이너 외부에서 접근하려면 0.0.0.0 바인딩이 필요하다.
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
