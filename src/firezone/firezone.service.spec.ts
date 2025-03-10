import { Test, TestingModule } from '@nestjs/testing';
import { FirezoneService } from './firezone.service';

describe('FirezoneService', () => {
  let service: FirezoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirezoneService],
    }).compile();

    service = module.get<FirezoneService>(FirezoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
