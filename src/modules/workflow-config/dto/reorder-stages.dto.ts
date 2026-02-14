import { IsArray, ValidateNested, IsMongoId, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class StagePositionDto {
  @IsMongoId()
  id: string;

  @IsNumber()
  position: number;
}

export class ReorderStagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StagePositionDto)
  stages: StagePositionDto[];
}
