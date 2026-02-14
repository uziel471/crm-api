import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  WorkflowConfig,
  WorkflowConfigDocument,
} from '@modules/workflow-config/schemas/workflow-config.schema';
import { CreateWorkflowDto } from '@modules/workflow-config/dto/create-workflow.dto';
import { CreateStageDto } from '@modules/workflow-config/dto/create-stage.dto';
import { CreateFieldDto } from '@modules/workflow-config/dto/create-field.dto';
import { ReorderStagesDto } from '@modules/workflow-config/dto/reorder-stages.dto';
import { ReorderFieldsDto } from '@modules/workflow-config/dto/reorder-fields.dto';

@Injectable()
export class WorkflowConfigService {
  constructor(
    @InjectModel(WorkflowConfig.name)
    private readonly model: Model<WorkflowConfigDocument>,
  ) {}

  create(dto: CreateWorkflowDto) {
    return this.model.create(dto);
  }

  findGlobal() {
    return this.model.findOne({ scope: 'global' }).lean();
  }

  async addStage(configId: string, dto: CreateStageDto) {
    return this.model.findByIdAndUpdate(
      configId,
      { $push: { stages: { ...dto, _id: new Types.ObjectId(), fields: [] } } },
      { new: true },
    );
  }

  async updateStage(
    configId: string,
    stageId: string,
    dto: Partial<CreateStageDto>,
  ) {
    return this.model.findOneAndUpdate(
      { _id: configId, 'stages._id': new Types.ObjectId(stageId) },
      {
        $set: {
          'stages.$.name': dto.name,
          'stages.$.color': dto.color,
          'stages.$.position': dto.position,
        },
      },
      { new: true },
    );
  }

  async removeStage(configId: string, stageId: string) {
    return this.model.findByIdAndUpdate(
      configId,
      { $pull: { stages: { _id: new Types.ObjectId(stageId) } } },
      { new: true },
    );
  }

  async addField(configId: string, stageId: string, dto: CreateFieldDto) {
    return this.model.findOneAndUpdate(
      { _id: configId, 'stages._id': new Types.ObjectId(stageId) },
      { $push: { 'stages.$.fields': { ...dto, _id: new Types.ObjectId() } } },
      { new: true },
    );
  }

  async removeField(configId: string, stageId: string, fieldId: string) {
    return this.model.findOneAndUpdate(
      { _id: configId, 'stages._id': new Types.ObjectId(stageId) },
      { $pull: { 'stages.$.fields': { _id: fieldId } } },
      { new: true },
    );
  }

  async reorderStages(configId: string, dto: ReorderStagesDto) {
    const bulk = dto.stages.map((stage) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(configId),
          'stages._id': new Types.ObjectId(stage.id),
        },
        update: {
          $set: { 'stages.$.position': stage.position },
        },
      },
    }));

    if (bulk.length > 0) {
      await this.model.bulkWrite(bulk);
    }

    return this.findGlobal();
  }

  async reorderFields(
    configId: string,
    stageId: string,
    dto: ReorderFieldsDto,
  ) {
    const bulk = dto.fields.map((field) => ({
      updateOne: {
        filter: {
          _id: new Types.ObjectId(configId),
        },
        update: {
          $set: {
            'stages.$[stage].fields.$[field].position': field.position,
          },
        },
        arrayFilters: [
          { 'stage._id': new Types.ObjectId(stageId) },
          { 'field._id': new Types.ObjectId(field.id) },
        ],
      },
    }));

    if (bulk.length) {
      await this.model.bulkWrite(bulk);
    }

    return this.findGlobal();
  }
}
