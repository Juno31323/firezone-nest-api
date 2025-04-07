import { Test, TestingModule } from '@nestjs/testing';
import { FirezoneService } from './firezone.service';
import { Repository } from 'typeorm';
import { firezone } from './firezone.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FirezoneService', () => {
  let service: FirezoneService;
  let repository: Repository<firezone>;

  const mockFirezone: firezone = {
    fz_id: 1,
    fz_near_id: 'A123',
    fz_loc_sn: 1,
    si_nm: '서울특별시',
    sig_nm: '강남구',
    sig_sn: 11680,
    road_nm_addr: '테헤란로 123',
    bldg_num_addr: '삼성동 123-45',
    fz_pk_unit: 2,
    fz_geom: { type: 'Point', coordinates: [127.123, 37.456] } as any,
    fz_jur_bldg_ph: '02-1234-5678',
    fz_jur_nm: '강남소방서',
    fz_jur_ph: '02-9876-5432',
    crt_dt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirezoneService,
        {
          provide: getRepositoryToken(firezone),
          useValue: {
            find: jest.fn().mockResolvedValue([mockFirezone]),
          },
        },
      ],
    }).compile();

    service = module.get<FirezoneService>(FirezoneService);
    repository = module.get<Repository<firezone>>(getRepositoryToken(firezone));
  });

  describe('findAll', () => {
    it('should return an array of firezones from the repository', async () => {
      const result: firezone[] = await service.findAll();
      expect(result).toEqual([mockFirezone]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no firezones exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result: firezone[] = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});