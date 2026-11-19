import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    password: string,
    email?: string,
  ): Promise<{ accessToken: string; email: string }> {
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL')?.trim();

    if (
      adminEmail &&
      email?.trim().toLowerCase() !== adminEmail.toLowerCase()
    ) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    if (password !== adminPassword) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const resolvedEmail = email?.trim() || adminEmail || 'admin@portafolio';
    const payload = { role: 'admin', sub: 'portfolio-owner', email: resolvedEmail };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      email: resolvedEmail,
    };
  }
}
