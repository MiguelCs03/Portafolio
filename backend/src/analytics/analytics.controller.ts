import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { CreateEventDto, CreateVisitDto, TouchVisitDto } from './dto/visit.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('visits')
  createVisit(
    @Body() dto: CreateVisitDto,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-vercel-ip-country') vercelCountry?: string,
    @Headers('cf-ipcountry') cfCountry?: string,
  ) {
    return this.analyticsService.createVisit(dto, {
      fallbackCountry: vercelCountry || cfCountry,
      userAgent,
    });
  }

  @Post('visits/:id/touch')
  touchVisitPost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: TouchVisitDto,
  ) {
    return this.analyticsService.touchVisit(id, dto);
  }

  @Patch('visits/:id/touch')
  touchVisitPatch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: TouchVisitDto,
  ) {
    return this.analyticsService.touchVisit(id, dto);
  }

  @Post('events')
  createEvent(
    @Body() dto: CreateEventDto,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.analyticsService.createEvent(dto, userAgent);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard')
  getDashboard(
    @Query('days', new ParseIntPipe({ optional: true })) days?: number,
  ) {
    return this.analyticsService.getDashboard(days ?? 14);
  }

  @UseGuards(AuthGuard)
  @Delete('bots')
  cleanupBots() {
    return this.analyticsService.cleanupBots();
  }

  @UseGuards(AuthGuard)
  @Delete('reset')
  resetAll() {
    return this.analyticsService.resetAll();
  }

  @Post('track')
  track(
    @Body() dto: TrackEventDto,
    @Headers('user-agent') userAgent?: string,
    @Headers('x-vercel-ip-country') vercelCountry?: string,
    @Headers('cf-ipcountry') cfCountry?: string,
  ) {
    return this.analyticsService.track(dto, {
      userAgent,
      country: vercelCountry || cfCountry,
    });
  }

  @UseGuards(AuthGuard)
  @Get('summary')
  getSummary() {
    return this.analyticsService.getSummary();
  }
}
