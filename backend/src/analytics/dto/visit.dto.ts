import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVisitDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @MaxLength(100)
  visitor_id!: string;

  @IsString()
  @MaxLength(100)
  session_id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  path?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  referrer?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referrer_host?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utm_source?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utm_medium?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  utm_campaign?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  country_code?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country_name?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  device_type?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  browser?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  os?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20000)
  screen_width?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20000)
  screen_height?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  language?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string | null;
}

export class TouchVisitDto {
  @IsInt()
  @Min(0)
  @Max(7200)
  duration_seconds!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  scroll_depth!: number;
}

export class CreateEventDto {
  @IsString()
  @MaxLength(100)
  visitor_id!: string;

  @IsString()
  @MaxLength(100)
  session_id!: string;

  @IsOptional()
  @IsUUID()
  visit_id?: string | null;

  @IsString()
  @MaxLength(80)
  event_type!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  event_name?: string | null;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
