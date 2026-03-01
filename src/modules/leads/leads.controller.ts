import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LeadsService } from '@modules/leads/leads.service';
import { CreateLeadDto } from '@modules/leads/dto/create-lead.dto';
import { GetLeadsQueryDto } from '@modules/leads/dto/list-lead.dto';

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
}
