import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class TrackEventDto {
  @IsString()
  @IsIn(['page_view', 'project_click', 'social_click', 'contact_submit'])
  type!: string;

  @IsString()
  @MaxLength(200)
  path!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  target?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  referrer?: string;

  @IsOptional()
  @IsString()
  @IsIn(['desktop', 'mobile', 'tablet'])
  device?: string;
}
