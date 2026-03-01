import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead } from '@modules/leads/schemas/leads.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { WorkflowConfigService } from '@modules/workflow-config/workflow-config.service';
import { GetLeadsQueryDto } from '@modules/leads/dto/list-lead.dto';
import { User } from '@modules/users/user.schema';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly model: Model<Lead>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly workflowService: WorkflowConfigService,
  ) {}

  async create(dto: CreateLeadDto, user) {
    console.log('dto', dto);
    const stages = await this.workflowService.findStages();
    const selectedStageIndex = stages.findIndex(
      ({ _id: stageId }) => stageId.toString() === dto.stageId,
    );
    const stageHistory = stages
      .slice(0, selectedStageIndex + 1)
      .filter((s) => s.name !== 'abandonos')
      .map((stage, index) => ({
        stageId: stage._id,
        stageName: stage.name,
        color: stage.color,
        changedBy: user._id,
        timestamp: new Date(
          Date.now() - (selectedStageIndex - index) * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

    const stage = stages[selectedStageIndex];

    const lead = await this.model.create({
      ...dto,
      advisor: new Types.ObjectId(dto.advisor),
      currentStage: stage._id,
      currentStageSnapshot: {
        name: stage.name,
        color: stage.color,
        position: stage.position,
      },
      history: stageHistory,
    });

    return lead;
  }

  async list(query: GetLeadsQueryDto) {
    const match: any = { isActive: true };

    if (query.month) {
      const [year, month] = query.month.split('-').map(Number);

      const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      match.createdAt = { $gte: start, $lte: end };
    }

    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      match.createdAt = { $gte: start, $lte: end };
    }
    console.log('match', match);
    const [leads, stages] = await Promise.all([
      this.model
        .find(match)
        .populate([
          {
            path: 'advisor',
            model: this.userModel,
            select: '_id name',
          },
        ])
        .sort({ createdAt: -1 }),
      this.workflowService.findStages(),
    ]);

    const responses: any[] = [];

    for (const lead of leads) {
      const stage = stages.find(
        (s) => s._id.toString() === lead.currentStage.toString(),
      );
      if (!stage) {
        continue;
      }
      responses.push({
        _id: lead._id,
        name: lead.name,
        company: lead.company,
        value: lead.value,
        squareMeters: lead.squareMeters,
        tags: lead.tags,
        source: lead.source,
        createdAt: lead.createdAt,
        movedToStageAt: lead.movedToStageAt ?? lead.updatedAt,
        advisor: lead.advisor,
        stage: {
          _id: stage._id,
          name: stage.name,
          color: stage.color,
          position: stage.position,
        },
      });
    }

    return responses;
  }
}
