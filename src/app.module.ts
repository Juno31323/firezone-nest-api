import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirezoneModule } from './firezone/firezone.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CLOUDSQL_HOST ||
        `/cloudsql/${process.env.CLOUDSQL_INSTANCE_CONNECTION_NAME}`,
      port: parseInt(process.env.CLOUDSQL_PORT || '5432', 10), // 기본값 설정1212
      username: process.env.CLOUDSQL_USER,
      password: process.env.CLOUDSQL_PASS,
      database: process.env.CLOUDSQL_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,      
    }),
    FirezoneModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
