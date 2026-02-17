import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CampaignDailyStatsDocument = CampaignDailyStats & Document;

@Schema({ timestamps: true })
export class CampaignDailyStats {
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  date: Date;

  @Prop({ type: Number, default: 0 })
  leads: number;

  @Prop({ type: Number, default: 0 })
  conversions: number;

  @Prop({ type: Number, default: 0 })
  spend: number;
}

export const CampaignDailyStatsSchema =
  SchemaFactory.createForClass(CampaignDailyStats);

CampaignDailyStatsSchema.index({ campaign: 1, date: 1 }, { unique: true });
