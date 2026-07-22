import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

@Injectable()
export class ThrottlerLoginGuard extends ThrottlerGuard {
  protected async getErrorMessage(_context: ExecutionContext, _detail: ThrottlerLimitDetail): Promise<string> {
    return '잠시 후 다시 시도해주세요';
  }
}
