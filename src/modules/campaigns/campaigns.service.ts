import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Campaign,
  CampaignDocument,
} from '@modules/campaigns/schemas/campaign.schema';
import { CampaignDailyStats } from '@modules/campaigns/schemas/campaign-daily-stats.schema';
import { CreateCampaignDto } from '@modules/campaigns/dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,

    @InjectModel(CampaignDailyStats.name)
    private readonly dailyStatsModel: Model<CampaignDailyStats>,
  ) {}

  async create(dto: CreateCampaignDto) {
    return this.campaignModel.create({
      ...dto,
      users: (dto.users || []).map((id) => new Types.ObjectId(id)),
      products: (dto.products || []).map((id) => new Types.ObjectId(id)),
      stats: { leads: 0, conversions: 0, spend: 0 },
    });
  }

  async findAll(query) {
    const filter: any = {};

    if (query.status) filter.status = query.status;
    if (query.isActive !== undefined)
      filter.isActive = query.isActive === 'true';

    return this.campaignModel
      .find(filter)
      .populate('users', 'name email role')
      .populate('products', 'name price')
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return this.campaignModel
      .findById(id)
      .populate('users', 'name email role')
      .populate('products', 'name price');
  }

  async assignUsers(id: string, users: string[]) {
    return this.campaignModel.findByIdAndUpdate(
      id,
      { users: users.map((id) => new Types.ObjectId(id)) },
      { new: true },
    );
  }

  async assignProducts(id: string, products: string[]) {
    return this.campaignModel.findByIdAndUpdate(
      id,
      { products: products.map((id) => new Types.ObjectId(id)) },
      { new: true },
    );
  }

  async updateStatus(id: string, status: string) {
    if (!['draft', 'active', 'paused', 'finished'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    return this.campaignModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateStats(
    id: string,
    body: {
      leads?: number;
      conversions?: number;
      spend?: number;
    },
  ) {
    const campaign = await this.campaignModel.findById(id);
    if (!campaign) throw new BadRequestException('Campaign not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.dailyStatsModel.updateOne(
      {
        campaign: campaign._id,
        date: today,
      },
      {
        $inc: {
          leads: body.leads ?? 0,
          conversions: body.conversions ?? 0,
          spend: body.spend ?? 0,
        },
      },
      { upsert: true },
    );

    return this.campaignModel.findByIdAndUpdate(
      id,
      {
        $inc: {
          'stats.leads': body.leads ?? 0,
          'stats.conversions': body.conversions ?? 0,
          'stats.spend': body.spend ?? 0,
        },
      },
      { new: true },
    );
  }

  async getDashboard() {
    const [result] = await this.campaignModel.aggregate([
      {
        $group: {
          _id: null,
          activeCampaigns: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          totalLeads: { $sum: '$stats.leads' },
          totalConversions: { $sum: '$stats.conversions' },
          totalBudget: { $sum: '$budget' },
        },
      },
      {
        $project: {
          _id: 0,
          activeCampaigns: 1,
          totalLeads: 1,
          totalConversions: 1,
          totalBudget: 1,
        },
      },
    ]);

    return (
      result ?? {
        activeCampaigns: 0,
        totalLeads: 0,
        totalConversions: 0,
        totalBudget: 0,
      }
    );
  }
}
