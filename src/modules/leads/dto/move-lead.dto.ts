import { IsMongoId } from 'class-validator';

export class MoveLeadDto {
  @IsMongoId()
  stageId: string;
}
