import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
    });

    // 유저가 없어도 동일한 에러 반환 (정보 노출 방지)
    if (!user) {
      // timing attack 방지를 위해 더미 해시 비교
      await bcrypt.compare(password, '$2b$12$dummy.hash.to.prevent.timing.attacks.xxxxxx');
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다');
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다');
    }

    return { id: user.id, username: user.username };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
