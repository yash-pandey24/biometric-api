import { Test, TestingModule } from '@nestjs/testing';
import { DeleatedController } from './deleted.controller';

describe('DeleatedController', () => {
  let controller: DeleatedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleatedController],
    }).compile();

    controller = module.get<DeleatedController>(DeleatedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
