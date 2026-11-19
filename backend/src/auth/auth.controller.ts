import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

class LoginDto {
  @IsOptional()
  @IsEmail({}, { message: 'El correo no es válido' })
  email?: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.password, dto.email);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request & { user?: { email?: string } }) {
    return { email: req.user?.email ?? 'admin@portafolio' };
  }
}
