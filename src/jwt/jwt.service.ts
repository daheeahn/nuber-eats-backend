import * as jwt from 'jsonwebtoken';
import { Injectable, Inject } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    // 이러면 module에서 무언가를 service로 inject할 수 있다.
    // console.log('jwt.service.ts options', options);
  }
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey); // ConfigService 가져와서 this.config 해도 되긴함. 이런 방법도 있다~
  }
  verify(token: string) {
    //
    return jwt.verify(token, this.options.privateKey);
  }
}
