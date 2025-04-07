import { Controller, Get, Param } from '@nestjs/common';
import { FireCenterService } from './firecenter.service';

@Controller('firecenter')
export class FireCenterController {
  constructor(private readonly fireCenterService: FireCenterService) {}

  @Get()
  async getAllFireCenters() {
    return this.fireCenterService.getAllFireCenters();
  }

  // 소방서 이름에 해당하는 상세 정보 반환
  @Get(':name')
  async getFireCenterDetails(@Param('name') name: string) {
    return this.fireCenterService.getFireCenterDetails(name);  // 소방서 이름을 통해 세부 정보 반환
  }
}
