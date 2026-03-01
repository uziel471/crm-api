import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { LeadStageHistory } from '@modules/leads/schemas/history.schema';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop()
  address?: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Number })
  squareMeters?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  advisor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'WorkflowStage', required: true })
  currentStage: Types.ObjectId;

  @Prop({
    type: {
      name: String,
      color: String,
      position: Number,
    },
  })
  currentStageSnapshot: {
    name: string;
    color: string;
    position: number;
  };

  @Prop({ type: [LeadStageHistory], default: [] })
  history: LeadStageHistory[];

  @Prop({ enum: ['web', 'facebook', 'google', 'referido', 'otro'] })
  source: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: Date.now })
  movedToStageAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
