import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { LeadsService } from '@modules/leads/leads.service';
import { CreateLeadDto } from '@modules/leads/dto/create-lead.dto';
import { GetLeadsQueryDto } from '@modules/leads/dto/list-lead.dto';
import { MoveOpportunityDto } from './dto/move-direction-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @Get()
  list(@Query() query: GetLeadsQueryDto) {
    return this.service.list(query);
  }

  @Patch(':id/move')
  async moveLead(
    @Param('id') id: string,
    @Body('stageId') stageId: string,
    @Req() req,
  ) {
    return this.service.moveLead(id, stageId, req.user._id);
  }

  @Patch('move-direction')
  moveOpportunityDirection(@Body() dto: MoveOpportunityDto, @Req() req) {
    return this.service.moveByDirection(
      dto.opportunityId,
      dto.direction,
      req.user._id,
    );
  }
}
