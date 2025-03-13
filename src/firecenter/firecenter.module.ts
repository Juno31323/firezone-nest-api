import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { firecenter } from './firecenter.entity';
import { FireCenterService } from './firecenter.service';
import { FireCenterController } from './firecenter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([firecenter])],
  providers: [FireCenterService],
  controllers: [FireCenterController],
})
export class FireCenterModule {}