import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkflowStage } from '@modules/workflow-config/schemas/workflow-stage.schema';

export type WorkflowConfigDocument = WorkflowConfig & Document;

@Schema({ timestamps: true })
export class WorkflowConfig {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['global', 'user'], default: 'global' })
  scope: 'global' | 'user';

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  @Prop({ type: [Object], required: true })
  stages: WorkflowStage[];
}

export const WorkflowConfigSchema =
  SchemaFactory.createForClass(WorkflowConfig);
