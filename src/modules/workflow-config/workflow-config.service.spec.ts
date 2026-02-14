import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowConfigService } from './workflow-config.service';

describe('WorkflowConfigService', () => {
  let service: WorkflowConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowConfigService],
    }).compile();

    service = module.get<WorkflowConfigService>(WorkflowConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
