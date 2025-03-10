import { Module } from '@nestjs/common';
import { FirezoneController } from './firezone.controller';
import { FirezoneService } from './firezone.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { firezone } from './firezone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([firezone])],
  controllers: [FirezoneController],
  providers: [FirezoneService]
})
export class FirezoneModule {}
