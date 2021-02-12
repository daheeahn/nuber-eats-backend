import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// export class JwtMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('headers', req.headers);
//     next();
//   }
// }

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('headers', req.headers);
  next();
}
