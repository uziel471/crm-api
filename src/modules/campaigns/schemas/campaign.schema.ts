import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { CampaignStats } from '@modules/campaigns/schemas/campaign-stats.schema';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({
    enum: ['facebook', 'google', 'linkedin', 'email'],
    required: true,
  })
  platform: 'facebook' | 'google' | 'linkedin' | 'email';

  @Prop({ trim: true })
  externalId?: string;

  @Prop({ select: false })
  accessToken?: string;

  @Prop({
    enum: ['draft', 'active', 'paused', 'finished'],
    default: 'draft',
  })
  status: 'draft' | 'active' | 'paused' | 'finished';

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Number, required: true })
  budget: number;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  products: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  users: Types.ObjectId[];

  @Prop({ type: () => CampaignStats })
  stats?: CampaignStats;

  @Prop({ default: true })
  isActive: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
