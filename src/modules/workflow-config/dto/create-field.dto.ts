import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFieldDto {
  @IsString()
  name: string;

  @IsIn(['text', 'textarea', 'number', 'date', 'email', 'phone', 'select'])
  type: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  options?: string[];

  @IsNumber()
  position: number;
}
