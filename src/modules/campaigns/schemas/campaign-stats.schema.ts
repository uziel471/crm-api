import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CampaignStats {
  @Prop({ type: Number, default: 0 })
  leads: number;

  @Prop({ type: Number, default: 0 })
  conversions: number;

  @Prop({ type: Number, default: 0 })
  spend: number;
}

export const CampaignStatsSchema = SchemaFactory.createForClass(CampaignStats);
