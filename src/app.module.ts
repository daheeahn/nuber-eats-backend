import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_DEV === 'dev' ? '.env.dev' : '.env.test', // prod은 나중에
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // production 환경일 땐 환경변수 파일 사용 X 다른 방법으로 얻는다.
      // validationSchema // 환경변수의 유효성 검증 (다음 강의)
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // 안먹힌다!!!!!!
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // host: 'localhost',
      // port: 5000,
      // username: 'daheeahn',
      // password: '12345',
      // database: 'nuber-eats',
      synchronize: true, // 데이터베이스를 내 모듈의 현재 상태로 마이그레이션한다는 뜻
      logging: true, // 데이터베이스에서 무슨 일이 일어나는지 콘솔에 표시
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
