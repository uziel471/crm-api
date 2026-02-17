import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Campaign,
  CampaignSchema,
} from '@modules/campaigns/schemas/campaign.schema';
import {
  CampaignDailyStats,
  CampaignDailyStatsSchema,
} from '@modules/campaigns/schemas/campaign-daily-stats.schema';
import { CampaignsService } from '@modules/campaigns/campaigns.service';
import { CampaignsController } from '@modules/campaigns/campaigns.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: CampaignDailyStats.name, schema: CampaignDailyStatsSchema },
    ]),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
