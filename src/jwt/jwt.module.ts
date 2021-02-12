import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';

@Module({
  // providers: [JwtService]
})
@Global() // import 안해도 사용 가능
export class JwtModule {
  // 아직 이해 X
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        // BANANAS라는 provider가 있고, 그 value가 options인 것.
        {
          provide: CONFIG_OPTIONS, // 다른 class도 provide 가능
          useValue: options,
        },
        // 이렇게 쓸 수도 있음.
        // {
        //   provide: JwtService,
        //   useClass: JwtService
        // }
        JwtService,
      ],
    };
  }
}
