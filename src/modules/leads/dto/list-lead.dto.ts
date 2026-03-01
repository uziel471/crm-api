import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetLeadsQueryDto {
  @IsOptional()
  @IsString()
  month?: string; // 2025-11

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
