import { IsEnum, IsMongoId } from 'class-validator';

export class MoveOpportunityDto {
  @IsMongoId()
  opportunityId: string;

  @IsEnum(['forward', 'backward', 'abandon'])
  direction: 'forward' | 'backward' | 'abandon';
}
