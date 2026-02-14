import { Types } from 'mongoose';

export type WorkflowFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'phone'
  | 'select';

export class WorkflowField {
  _id: Types.ObjectId;

  name: string;

  type: WorkflowFieldType;

  placeholder?: string;

  required: boolean;

  options?: string[];

  position: number;
}
