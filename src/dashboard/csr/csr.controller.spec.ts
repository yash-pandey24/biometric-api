import { Test, TestingModule } from '@nestjs/testing';
import { CsrController } from './csr.controller';

describe('CsrController', () => {
  let controller: CsrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsrController],
    }).compile();

    controller = module.get<CsrController>(CsrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
