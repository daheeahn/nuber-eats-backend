import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      username: 'daheeahn',
      // localhost로 연결되어 있다면 비밀번호 묻지 않는다.
      password: '12345', // 그러나 릴리즈에서는 제대로된 비밀번호를 써야겠지.
      database: 'nuber-eats',
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
