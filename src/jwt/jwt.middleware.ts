import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/entities/users.service';

// option 1 (users repository 써야하니까 우리는 이거)
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, // UsersService를 UsersModule에서 export해줘야 사용가능
  ) {
    // Injectable 써야만 이 jwtService 쓸 수 있다~
  }
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('headers ', req.headers);
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      console.log('Token: ', token);
      const decoded = this.jwtService.verify(token.toString()); // token을 확실히 string으로 확신할 수 있도록.
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        console.log(decoded['id']);
        try {
          const user = await this.usersService.findById(decoded['id']);
          console.log('user', user); // cool!
          // user를 이제 request로 보낼거야!
          req['user'] = user;
        } catch (error) {
          console.log('use function error', error);
        }
      }
    }
    next();
  }
}
// option 2
export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  // console.log('headers 2', req.headers);
  next();
}
