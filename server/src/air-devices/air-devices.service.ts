import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AirDeviceItemDto } from './dto/air-device-item.dto';
import { CreateAirDeviceDto } from './dto/create-air-device.dto';
import { ReorderAirDevicesDto } from './dto/reorder-air-devices.dto';
import { UpdateAirDeviceDto } from './dto/update-air-device.dto';

/**
 * 측정 항목(items)은 항상 order 오름차순으로 include 한다.
 * 공개/어드민/단건 응답 모두 동일한 include 를 사용해 응답 형태를 통일한다.
 */
const includeItems = {
  items: { orderBy: { order: 'asc' as const } },
};

@Injectable()
export class AirDevicesService {
  constructor(private readonly prisma: PrismaService) {}

  /** 공개 목록 — published=true 만. order ASC, createdAt ASC(보조). */
  async findAll() {
    return this.prisma.airDevice.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: includeItems,
    });
  }

  /** 어드민 목록 — 미공개(published=false) 포함 전체. */
  async findAllAdmin() {
    return this.prisma.airDevice.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: includeItems,
    });
  }

  async findOne(id: string) {
    const device = await this.prisma.airDevice.findUnique({
      where: { id },
      include: includeItems,
    });
    if (!device) {
      throw new NotFoundException(`AirDevice #${id} not found`);
    }
    return device;
  }

  /**
   * 측정 항목 DTO 배열 → Prisma nested create 입력으로 정규화한다.
   * order 미지정 시 배열 인덱스를 채번한다(전달 순서 = 표시 순서).
   */
  private toItemCreateInput(items: AirDeviceItemDto[]) {
    return items.map((item, index) => ({
      code: item.code,
      label: item.label,
      order: item.order ?? index,
    }));
  }

  /**
   * 레코드 생성.
   * - order 미지정 시 맨 뒤 append: 현재 최대 order + 1 (없으면 0).
   * - published 미지정 시 Prisma 기본값(true) 적용을 위해 키 자체를 넘기지 않는다.
   * - items 는 중첩 생성한다.
   */
  async create(dto: CreateAirDeviceDto) {
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.airDevice.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = last ? last.order + 1 : 0;
    }

    const items = dto.items ? this.toItemCreateInput(dto.items) : [];

    return this.prisma.airDevice.create({
      data: {
        name: dto.name,
        subtitle: dto.subtitle,
        badge: dto.badge,
        size: dto.size,
        weight: dto.weight,
        power: dto.power,
        comm: dto.comm,
        storage: dto.storage,
        operatingTemp: dto.operatingTemp,
        order,
        ...(dto.published !== undefined ? { published: dto.published } : {}),
        ...(items.length > 0 ? { items: { create: items } } : {}),
      },
      include: includeItems,
    });
  }

  /**
   * 드래그앤드롭 일괄 순서변경.
   *
   * 응답은 **어드민 전체 배열**(미공개 포함)이다. 공개 findAll()(published=true 만)을
   * 반환하면 어드민 화면에서 미공개 카드가 사라진다.
   */
  async reorder(dto: ReorderAirDevicesDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.airDevice.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAllAdmin();
  }

  /**
   * 부분 수정. 전달된 필드만 갱신한다.
   *
   * items replace-all(전체 교체) 시맨틱:
   * - 미전달(undefined): 기존 항목 그대로 유지.
   * - 전달(배열): 기존 항목 deleteMany 후 전달 배열 재생성.
   * - []: 전부 삭제하고 재생성하지 않음.
   * deleteMany + nested create 는 단일 $transaction 으로 묶어 중간 실패 시
   * 항목이 사라진 채로 남지 않게 한다.
   */
  async update(id: string, dto: UpdateAirDeviceDto) {
    await this.findOne(id);

    const data: Prisma.AirDeviceUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.subtitle !== undefined) data.subtitle = dto.subtitle;
    if (dto.badge !== undefined) data.badge = dto.badge;
    if (dto.size !== undefined) data.size = dto.size;
    if (dto.weight !== undefined) data.weight = dto.weight;
    if (dto.power !== undefined) data.power = dto.power;
    if (dto.comm !== undefined) data.comm = dto.comm;
    if (dto.storage !== undefined) data.storage = dto.storage;
    if (dto.operatingTemp !== undefined) data.operatingTemp = dto.operatingTemp;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.published !== undefined) data.published = dto.published;

    // items 미전달 → 기존 항목 유지. 스칼라 필드만 갱신한다.
    if (dto.items === undefined) {
      return this.prisma.airDevice.update({
        where: { id },
        data,
        include: includeItems,
      });
    }

    // items 전달 → replace-all. 삭제 + 재생성을 단일 트랜잭션으로 묶는다.
    const items = this.toItemCreateInput(dto.items);
    const [, device] = await this.prisma.$transaction([
      this.prisma.airDeviceItem.deleteMany({ where: { deviceId: id } }),
      this.prisma.airDevice.update({
        where: { id },
        data: {
          ...data,
          ...(items.length > 0 ? { items: { create: items } } : {}),
        },
        include: includeItems,
      }),
    ]);

    return device;
  }

  async remove(id: string) {
    await this.findOne(id);
    // AirDeviceItem 은 onDelete: Cascade 로 함께 삭제된다.
    return this.prisma.airDevice.delete({ where: { id } });
  }

  /** R2 업로드 후 받은 URL 로 제품 사진을 갱신한다(partners 로고 패턴). */
  async uploadImage(id: string, imageUrl: string) {
    await this.findOne(id);
    return this.prisma.airDevice.update({
      where: { id },
      data: { imageUrl },
      include: includeItems,
    });
  }
}
