import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersResolver } from './entities/users.resolver';
import { UsersService } from './entities/users.service';

@Module({
  // ConfigService import했으니 users.service에서 쓸 수 있어 = 환경변수를 process.env 안하고 this.config로 쓸 수 있음 (users.service에서 확인)
  // 이게 nestjs의 장점. app.module.ts - imports에 모듈을 설치하고, 각 모듈 (ex)UserModule에서 ConfigService 사용가능! 왜? app.module에서 ConfigModule을 설정해줬으니까.
  // 그러면 UserService에서 config를 constructor에서 불러올 수 있음.
  imports: [TypeOrmModule.forFeature([User])], // ConfigService, JwtService는 global이라 import 안해줘도 됨
  providers: [UsersResolver, UsersService],
  exports: [UsersService], // 이걸 안하면 jwt service에서 usersService 사용할 수 없음. export를 안하니까!
})
export class UsersModule {}
