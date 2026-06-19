import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerLoginGuard extends ThrottlerGuard {
  protected getErrorMessage(): string {
    return '잠시 후 다시 시도해주세요';
  }
}
