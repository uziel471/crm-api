import { IsArray, IsMongoId } from 'class-validator';

export class UpdateProductUsersDto {
  @IsArray()
  @IsMongoId({ each: true })
  users: string[];
}
