import { Injectable, Inject } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    // 이러면 module에서 무언가를 service로 inject할 수 있다.
    console.log('jwt.service.ts options', options);
  }
  hello() {
    console.log('hello');
  }
}
