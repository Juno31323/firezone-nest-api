import { Test, TestingModule } from '@nestjs/testing';
import { FirezoneController } from './firezone.controller';
import { FirezoneService } from './firezone.service';
import { firezone } from './firezone.entity';

describe('FirezoneController', () => {
  let controller: FirezoneController;
  let service: FirezoneService;

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
      controllers: [FirezoneController],
      providers: [
        {
          provide: FirezoneService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockFirezone]),
          },
        },
      ],
    }).compile();

    controller = module.get<FirezoneController>(FirezoneController);
    service = module.get<FirezoneService>(FirezoneService);
  });

  describe('findAll', () => {
    it('should return an array of firezones', async () => {
      const result: firezone[] = await controller.findAll();
      expect(result).toEqual([mockFirezone]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  it('should return an empty array if no firezones exist', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([]);
    const result: firezone[] = await controller.findAll();
    expect(result).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });
});