import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() value?: number;
  @IsOptional() @IsNumber() squareMeters?: number;
  @IsOptional() @IsArray() tags?: string[];
}
