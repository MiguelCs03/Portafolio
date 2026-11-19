import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(password: string): Promise<{ accessToken: string }> {
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';

    if (password !== adminPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { role: 'admin', sub: 'portfolio-owner' };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
