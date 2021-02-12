import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({
  // providers: [JwtService]
})
@Global() // import 안해도 사용 가능
export class JwtModule {
  // 아직 이해 X
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService],
    };
  }
}
