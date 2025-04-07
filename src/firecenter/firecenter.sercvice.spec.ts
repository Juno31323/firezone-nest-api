import { Test, TestingModule } from '@nestjs/testing';
import { FireCenterService } from './firecenter.service';
import { Repository } from 'typeorm';
import { firecenter } from './firecenter.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FireCenterService', () => {
  let service: FireCenterService;
  let repository: Repository<firecenter>;

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
      providers: [
        FireCenterService,
        {
          provide: getRepositoryToken(firecenter),
          useValue: {
            find: jest.fn().mockResolvedValue([mockFireCenter]),
            findOne: jest.fn().mockResolvedValue(mockFireCenter),
          },
        },
      ],
    }).compile();

    service = module.get<FireCenterService>(FireCenterService);
    repository = module.get<Repository<firecenter>>(getRepositoryToken(firecenter));
  });

  describe('getAllFireCenters', () => {
    it('should return an array of fire centers', async () => {
      const result = await service.getAllFireCenters();
      expect(result).toEqual([mockFireCenter]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no fire centers exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result = await service.getAllFireCenters();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getFireCenterDetails', () => {
    it('should return a fire center by name', async () => {
      const result = await service.getFireCenterDetails('강남소방서');
      expect(result).toEqual(mockFireCenter);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { fc_nm: '강남소방서' } });
    });

    it('should throw an Error if fire center is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.getFireCenterDetails('없는소방서')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { fc_nm: '없는소방서' } });
    });
  });
});