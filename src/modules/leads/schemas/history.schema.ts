import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type LeadStageHistoryDocument = LeadStageHistory & Document;

@Schema()
export class LeadStageHistory {
  @Prop({ type: Types.ObjectId })
  stageId: Types.ObjectId;

  @Prop()
  stageName: string;

  @Prop()
  color: string;

  @Prop()
  changedBy?: Types.ObjectId;

  @Prop({ default: Date.now })
  changedAt: Date;

  @Prop({ type: Map, of: String })
  filledFields?: Record<string, any>;
}

export const LeadStageHistorySchema =
  SchemaFactory.createForClass(LeadStageHistory);
