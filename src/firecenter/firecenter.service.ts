import { Injectable, NotFoundException } from '@nestjs/common';
import { firecenter } from './firecenter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FireCenterService {
    constructor( 
        @InjectRepository(firecenter)
        private FirecenterRepository: Repository<firecenter>,
    ) {} 

   // 모든 소방서 목록 반환
  async getAllFireCenters() {
    return this.FirecenterRepository.find();  // 모든 소방서 목록 반환
  }

  // 소방서 이름에 해당하는 상세 정보 반환
  async getFireCenterDetails(name: string) {
    const fireCenter = await this.FirecenterRepository.findOne({ where: { fc_nm: name } });
    if (!fireCenter) {
      throw new NotFoundException('Fire center not found');
    }
    return fireCenter;  // 소방서 상세 정보 반환
  }
}
