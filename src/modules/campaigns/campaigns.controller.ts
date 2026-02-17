import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampaignsService } from '@modules/campaigns/campaigns.service';
import { CreateCampaignDto } from '@modules/campaigns/dto/create-campaign.dto';
import { UpdateCampaignUsersDto } from '@modules/campaigns/dto/update-campaign-users.dto';
import { UpdateCampaignProductsDto } from '@modules/campaigns/dto/update-campaign-products.dto';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Post()
  create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Get('dashboard')
  dashboard() {
    return this.service.getDashboard();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/users')
  assignUsers(@Param('id') id: string, @Body() dto: UpdateCampaignUsersDto) {
    return this.service.assignUsers(id, dto.users);
  }

  @Patch(':id/products')
  assignProducts(
    @Param('id') id: string,
    @Body() dto: UpdateCampaignProductsDto,
  ) {
    return this.service.assignProducts(id, dto.products);
  }

  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.service.updateStatus(id, status);
  }

  @Post(':id/stats')
  updateStats(@Param('id') id: string, @Body() body) {
    return this.service.updateStats(id, body);
  }
}
