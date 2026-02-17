export class CreateCampaignDto {
  name: string;
  description?: string;
  platform: 'facebook' | 'google' | 'linkedin' | 'email';
  externalId?: string;
  accessToken?: string;
  budget: number;
  startDate: Date;
  endDate?: Date;
  products: string[];
  users: string[];
}
