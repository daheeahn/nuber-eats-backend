import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { jwtMiddleware, JwtMiddleware } from './jwt/jwt.middleware';
import { pathToArray } from 'graphql/jsutils/Path';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Category } from './restaurants/entities/category.entity';
import { Dish } from './restaurants/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './restaurants/entities/order-item.entity';

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
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIL_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
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
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ], // 이걸 해줘야 postico에서 보임. db에 반영됨.
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true, // 서버가 웹소켓 기능을 가지게 된다.
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY, // JwtService에서 그냥 this.config 해도 되긴함. 이런 방법도 있다~
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIL_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
// export class AppModule implements NestModule {
//   // *** 특정 옵션 넣고 싶을 떄
//   configure(consumer: MiddlewareConsumer) {
//     // jwtMiddleware처럼 그냥 function으로 써도 되고, JwtMiddleware class로 써도되고~
//     // 우리는 users repository 써야하니까 class로 쓰자!
//     consumer.apply(JwtMiddleware).forRoutes({
//       // path에 해당하고, post만 JwtMiddleware가 먹히도록 설정.
//       path: '/graphql',
//       // path: '*',
//       // method: RequestMethod.POST,
//       method: RequestMethod.ALL,
//     });
//     // *팁) .exclude 함수만 바꿔주면 모든 그 안 옵션에 있는 pathToArray, method는 제외시켜준다.
//   }
// }

// 이제 HTTP와 웹소켓 모두에서 인증할 수 있는 방법을 찾아야해.
export class AppModule {}
