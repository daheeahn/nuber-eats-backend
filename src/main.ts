import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { jwtMiddleware } from './jwt/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(jwtMiddleware); // *** 전체경로에서 사용해도 될 때 // functional middleware만 이용 가능. 그래서 class로 써야하면 (우리 상황) AppModule에서 해줘야 함
  await app.listen(3000);
}
bootstrap();
