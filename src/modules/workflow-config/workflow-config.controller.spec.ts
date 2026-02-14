import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowConfigController } from './workflow-config.controller';

describe('WorkflowConfigController', () => {
  let controller: WorkflowConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowConfigController],
    }).compile();

    controller = module.get<WorkflowConfigController>(WorkflowConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
