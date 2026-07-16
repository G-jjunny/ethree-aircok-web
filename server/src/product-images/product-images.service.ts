import { Injectable } from '@nestjs/common';
import { ProductImageSlot } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductImagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 등록된 슬롯 행 전체를 배열로 반환한다(미등록 슬롯은 응답에 없음).
   *
   * 이 모델에는 order 컬럼이 없다(순서는 프론트 레이아웃이 결정). 응답 순서 안정성만
   * 확보하면 되므로 createdAt 오름차순으로 정렬한다.
   */
  async findAll() {
    return this.prisma.productSectionImage.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * 어드민 목록 — 공개 findAll() 과 결과가 완전히 동일하다.
   *
   * 다른 모듈의 findAllAdmin() 은 "미공개 포함" 같은 필터 차이가 있지만, 이 모델에는
   * published 플래그가 없어 필터링할 것이 없다. 그럼에도 별도 엔드포인트를 두는 이유는
   * **HTTP 캐시 회피**다: 공개 GET 은 CacheControlInterceptor(60) 로 60초 캐시되므로,
   * 어드민이 업로드/삭제 직후 목록을 다시 불러오면 갱신 전 응답을 볼 수 있다.
   * 어드민 전용 경로를 분리해 no-store 헤더를 붙이면 항상 최신 상태가 보장된다.
   * (컨트롤러의 GET /admin 참고)
   */
  async findAllAdmin() {
    return this.findAll();
  }

  /**
   * slot 기준 upsert — 있으면 imageUrl 교체, 없으면 생성.
   * slot 에 @unique 가 걸려 있어 슬롯당 1행이 DB 레벨에서 보장된다 → 멱등한 PUT 시맨틱.
   */
  async upsert(slot: ProductImageSlot, imageUrl: string) {
    return this.prisma.productSectionImage.upsert({
      where: { slot },
      update: { imageUrl },
      create: { slot, imageUrl },
    });
  }

  /**
   * 슬롯 행 삭제. 미등록 슬롯이어도 204 — 멱등하다.
   *
   * 다른 모듈의 remove() 는 "존재 확인 후 없으면 404" 패턴이지만, 이 모델은 의도적으로 다르다.
   * 여기서 :slot 은 사용자가 생성한 리소스 id 가 아니라 enum 으로 고정된 슬롯 주소이며
   * (ParseEnumPipe 가 유효하지 않은 슬롯을 이미 400 으로 걸러낸다), 슬롯의 존재 자체는 상수다.
   * 존재/부재가 갈리는 것은 "그 슬롯에 이미지가 있는가"뿐이다.
   * PUT 이 upsert 로 "이 슬롯을 이 이미지로 만든다"를 멱등하게 보장하므로,
   * DELETE 도 대칭적으로 "이 슬롯을 비운다"를 멱등하게 보장해야 한다 —
   * 목표 상태(빈 슬롯)가 이미 달성된 재요청은 실패가 아니다.
   * 실무상으로도 어드민 더블클릭/재시도가 무해해지고, 프론트가 404 를 성공으로 변환하는
   * 방어 코드를 둘 필요가 없다.
   *
   * deleteMany 를 쓰는 이유: 단건 delete() 는 대상이 없으면 P2025 를 던진다.
   */
  async remove(slot: ProductImageSlot) {
    await this.prisma.productSectionImage.deleteMany({ where: { slot } });
  }
}
