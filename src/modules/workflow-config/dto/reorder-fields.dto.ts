import { IsArray, ValidateNested, IsMongoId, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class FieldPositionDto {
  @IsMongoId()
  id: string;

  @IsNumber()
  position: number;
}

export class ReorderFieldsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldPositionDto)
  fields: FieldPositionDto[];
}
