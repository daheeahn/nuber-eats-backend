import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Joi from 'joi'; // Joi = undefined
// *** => 타입스크립트나 NestJS로 되어있지 않은 패키지는 * as로 import 해야함.
import * as Joi from 'joi';

import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/users.entity';
import { JwtModule } from './jwt/jwt.module';

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
        PRIVATE_KEY: Joi.string().required(), // token을 지정하기 위해 사용하는 privateKey
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // true: 데이터베이스를 내 모듈의 현재 상태로 마이그레이션한다는 뜻
      // TypeORM이 Entity를 찾고 알아서 migration 해주는 것이다. DB의 구성을 자동으로 바꿔준다.
      synchronize: process.env.NODE_ENV !== 'prod', // prod은 따로 하고 싶을 수 있으니까
      logging: process.env.NODE_ENV !== 'prod', // 데이터베이스에서 무슨 일이 일어나는지 콘솔에 표시
      entities: [User],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
