import { Test, TestingModule } from '@nestjs/testing';
import { FirezoneController } from './firezone.controller';

describe('FirezoneController', () => {
  let controller: FirezoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirezoneController],
    }).compile();

    controller = module.get<FirezoneController>(FirezoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
