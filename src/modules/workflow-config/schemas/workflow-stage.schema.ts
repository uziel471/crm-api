import { Types } from 'mongoose';

import { WorkflowField } from '@modules/workflow-config/schemas/workflow-field.schema';

export class WorkflowStage {
  _id: Types.ObjectId;

  name: string;

  color: string;

  position: number;

  fields: WorkflowField[];
}
