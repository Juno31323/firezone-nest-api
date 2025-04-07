import { Test, TestingModule } from '@nestjs/testing';
import { FireCenterController } from './firecenter.controller';
import { FireCenterService } from './firecenter.service';
import { firecenter } from './firecenter.entity';
import { NotFoundException } from '@nestjs/common';

describe('FireCenterController', () => {
  let controller: FireCenterController;
  let service: FireCenterService;

  const mockFireCenter: firecenter = {
    fc_id: 1,
    fc_geom: { type: 'Point', coordinates: [127.123, 37.456] } as any,
    fc_unq_id: 1001,
    fc_nm: '강남소방서',
    fc_type_nm: '소방서',
    fz_lgnd_id: 0,
    fc_number: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FireCenterController],
      providers: [
        {
          provide: FireCenterService,
          useValue: {
            getAllFireCenters: jest.fn().mockResolvedValue([mockFireCenter]),
            getFireCenterDetails: jest.fn().mockResolvedValue(mockFireCenter),
          },
        },
      ],
    }).compile();

    controller = module.get<FireCenterController>(FireCenterController);
    service = module.get<FireCenterService>(FireCenterService);
  });

  describe('getAllFireCenters', () => {
    it('should return an array of fire centers', async () => {
      const result: firecenter[] = await controller.getAllFireCenters();
      expect(result).toEqual([mockFireCenter]);
      expect(service.getAllFireCenters).toHaveBeenCalled();
    });

    it('should return an empty array if no fire centers exist', async () => {
      jest.spyOn(service, 'getAllFireCenters').mockResolvedValueOnce([]);
      const result: firecenter[] = await controller.getAllFireCenters();
      expect(result).toEqual([]);
      expect(service.getAllFireCenters).toHaveBeenCalled();
    });
  });

  describe('getFireCenterDetails', () => {
    it('should return details of a specific fire center by name', async () => {
      const result: firecenter = await controller.getFireCenterDetails('강남소방서');
      expect(result).toEqual(mockFireCenter);
      expect(service.getFireCenterDetails).toHaveBeenCalledWith('강남소방서');
    });
  
    it('should throw NotFoundException if fire center is not found', async () => {
      jest.spyOn(service, 'getFireCenterDetails').mockRejectedValueOnce(
        new NotFoundException(`Fire center with name "없는소방서" not found`),
      );
      await expect(controller.getFireCenterDetails('없는소방서')).rejects.toThrow(NotFoundException);
      expect(service.getFireCenterDetails).toHaveBeenCalledWith('없는소방서');
    });
  });
});