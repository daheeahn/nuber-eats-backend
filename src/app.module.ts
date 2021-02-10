import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Joi from 'joi'; // Joi = undefined
// *** => 타입스크립트나 NestJS로 되어있지 않은 패키지는 * as로 import 해야함.
import * as Joi from 'joi';

import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

// console.log(Joi); // 그냥 import Joi하면 undefined가 찍힘

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test', // prod은 나중에
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // production 환경일 땐 환경변수 파일 사용 X 다른 방법으로 얻는다.
      // 환경변수의 유효성 검증
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
