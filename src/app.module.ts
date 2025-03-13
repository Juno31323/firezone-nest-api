import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirezoneModule } from './firezone/firezone.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 환경 변수 로드
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용 가능
      envFilePath: '.env', // 로컬 개발용, Cloud Run에서는 무시됨
    }),

    // TypeORM 설정 (Cloud SQL 연결)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('CLOUDSQL_HOST') || 
              `/cloudsql/${configService.get('CLOUDSQL_INSTANCE_CONNECTION_NAME')}`,
        port: configService.get<number>('CLOUDSQL_PORT', 5432),
        username: configService.get('CLOUDSQL_USER'),
        password: configService.get('CLOUDSQL_PASS'),
        database: configService.get('CLOUDSQL_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // 배포 : false, 개발 : true
        logging: true, // 디버깅용
        extra: {
          socketPath: configService.get('CLOUDSQL_HOST') || 
                      `/cloudsql/${configService.get('CLOUDSQL_INSTANCE_CONNECTION_NAME')}`,
        },
      }),
      inject: [ConfigService],
    }),

    // 모듈 임포트
    FirezoneModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}