import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createHash } from 'crypto';
import type { Request, Response } from 'express';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * 공개(비인증) 콘텐츠 목록 GET 응답에 HTTP 캐싱 헤더를 부여하는 인터셉터.
 *
 * 동작:
 * - 응답 body 를 JSON.stringify → sha1 해시로 약한 ETag(`W/"<hash>"`)를 계산한다.
 * - `Cache-Control: public, max-age=<ttl>` 와 `ETag` 헤더를 설정한다.
 * - 요청 `If-None-Match` 가 현재 ETag 와 일치하면 304 Not Modified + 빈 body 를 반환한다.
 *
 * 무효화:
 * - ETag 는 body 해시 기반이라 어드민 뮤테이션으로 콘텐츠가 바뀌면 자동으로 ETag 가
 *   달라져 재검증된다. 별도 서버측 캐시 저장소를 두지 않으므로 명시적 무효화 코드는 없다.
 *
 * 사용: `@UseInterceptors(new CacheControlInterceptor(60))` 형태로 공개 목록 GET 핸들러에만 부착한다.
 */
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private readonly ttlSeconds: number = 30) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      mergeMap((body: unknown) => {
        const serialized = JSON.stringify(body ?? null);
        const hash = createHash('sha1').update(serialized).digest('hex');
        const etag = `W/"${hash}"`;

        response.setHeader(
          'Cache-Control',
          `public, max-age=${this.ttlSeconds}`,
        );
        response.setHeader('ETag', etag);

        const ifNoneMatch = request.headers['if-none-match'];
        if (ifNoneMatch === etag) {
          // ETag 일치 → 인터셉터에서 직접 304로 응답을 종료하고
          // EMPTY 를 흘려 downstream 의 RouterResponseController.apply() 가
          // 실행되지 않게 한다(200 재설정 + 빈 body 덮어쓰기 방지).
          response.status(304).end();
          return EMPTY;
        }

        return of(body);
      }),
    );
  }
}
