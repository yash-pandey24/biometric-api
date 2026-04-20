import { Test, TestingModule } from '@nestjs/testing';
import { CsrService } from './csr.service';

describe('CsrService', () => {
  let service: CsrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsrService],
    }).compile();

    service = module.get<CsrService>(CsrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
