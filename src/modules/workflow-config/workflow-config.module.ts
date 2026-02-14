import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkflowConfigService } from '@modules/workflow-config/workflow-config.service';
import { WorkflowConfigController } from '@modules/workflow-config/workflow-config.controller';
import {
  WorkflowConfig,
  WorkflowConfigSchema,
} from './schemas/workflow-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkflowConfig.name, schema: WorkflowConfigSchema },
    ]),
  ],
  controllers: [WorkflowConfigController],
  providers: [WorkflowConfigService],
  exports: [WorkflowConfigService],
})
export class WorkflowModule {}
