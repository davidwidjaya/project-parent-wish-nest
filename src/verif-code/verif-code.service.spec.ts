import { Test, TestingModule } from '@nestjs/testing';
import { VerifCodeService } from './verif-code.service';

describe('VerifCodeService', () => {
  let service: VerifCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifCodeService],
    }).compile();

    service = module.get<VerifCodeService>(VerifCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
