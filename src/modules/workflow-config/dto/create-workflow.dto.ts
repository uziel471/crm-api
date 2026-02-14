import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['global', 'user'])
  scope?: 'global' | 'user';
}
