import { Test, TestingModule } from '@nestjs/testing';
import { VerifCodeController } from './verif-code.controller';

describe('VerifCodeController', () => {
  let controller: VerifCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifCodeController],
    }).compile();

    controller = module.get<VerifCodeController>(VerifCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
