import { IsHexColor, IsNumber, IsString } from 'class-validator';

export class CreateStageDto {
  @IsString()
  name: string;

  @IsHexColor()
  color: string;

  @IsNumber()
  position: number;
}
