import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  squareMeters?: number;

  @IsMongoId()
  advisor: string;

  @IsMongoId()
  stageId: string;

  @IsString()
  source: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
