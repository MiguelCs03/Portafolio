import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

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
