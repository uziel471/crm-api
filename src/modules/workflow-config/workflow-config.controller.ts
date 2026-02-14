import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { WorkflowConfigService } from '@modules/workflow-config/workflow-config.service';
import { CreateWorkflowDto } from '@modules/workflow-config/dto/create-workflow.dto';
import { CreateStageDto } from '@modules/workflow-config/dto/create-stage.dto';
import { CreateFieldDto } from '@modules/workflow-config/dto/create-field.dto';
import { ReorderStagesDto } from '@modules/workflow-config/dto/reorder-stages.dto';
import { ReorderFieldsDto } from '@modules/workflow-config/dto/reorder-fields.dto';

@ApiTags('Workflow Config')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('workflow-config')
export class WorkflowConfigController {
  constructor(private readonly service: WorkflowConfigService) {}

  @Post()
  create(@Body() dto: CreateWorkflowDto) {
    return this.service.create(dto);
  }

  @Get()
  get() {
    return this.service.findGlobal();
  }

  @Post(':id/stages')
  addStage(@Param('id') id: string, @Body() dto: CreateStageDto) {
    return this.service.addStage(id, dto);
  }

  @Put(':id/stages/:stageId')
  updateStage(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() dto: Partial<CreateStageDto>,
  ) {
    return this.service.updateStage(id, stageId, dto);
  }

  @Delete(':id/stages/:stageId')
  removeStage(@Param('id') id: string, @Param('stageId') stageId: string) {
    return this.service.removeStage(id, stageId);
  }

  @Post(':id/stages/:stageId/fields')
  addField(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() dto: CreateFieldDto,
  ) {
    return this.service.addField(id, stageId, dto);
  }

  @Delete(':id/stages/:stageId/fields/:fieldId')
  removeField(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Param('fieldId') fieldId: string,
  ) {
    return this.service.removeField(id, stageId, fieldId);
  }

  @Put(':id/reorder-stages')
  reorderStages(@Param('id') id: string, @Body() dto: ReorderStagesDto) {
    return this.service.reorderStages(id, dto);
  }

  @Put(':id/stages/:stageId/fields/reorder')
  reorderFields(
    @Param('id') id: string,
    @Param('stageId') stageId: string,
    @Body() dto: ReorderFieldsDto,
  ) {
    return this.service.reorderFields(id, stageId, dto);
  }
}
