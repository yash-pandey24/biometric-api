import { Test, TestingModule } from '@nestjs/testing';
import { DeletedService } from './deleted.service';

describe('DeletedService', () => {
  let service: DeletedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeletedService],
    }).compile();

    service = module.get<DeletedService>(DeletedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});