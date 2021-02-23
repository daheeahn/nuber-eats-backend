import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // authentication: token으로 identity 확인. = canActive에서 하는 작업.
  // authorization: user가 어떤 일 하기 전에 permission 확인. 이건 아직 안했어!
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );
    // console.log(role);
    if (!roles) {
      // public resolver
      return true;
    }
    // request를 계속 진행할건지 말건지 결정. request의 user가 유효할 수도 있고 아닐 수도 있으니 guard가 필요한거.
    // console.log('context');
    // console.log(context);
    // context가 http로 되어있는데, graphql로 바꿔야함.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // console.log('💝 gqlContext');
    const { token } = gqlContext;
    if (!token) {
      return false;
    }
    const decoded = this.jwtService.verify(token.toString()); // token을 확실히 string으로 확신할 수 있도록.
    if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
      // console.log(decoded['id']);
      const user = await this.usersService.findById(decoded['id']);
      if (!user) {
        return false;
      }

      // guard가 AuthUser decorator보다 먼저 호출돼서 이게 decorator에서 유효할 것이야.
      // 따로
      gqlContext['user'] = user;

      if (roles.includes('Any')) {
        return true;
      }
      return roles.includes(user.role);
    } else {
      return false;
    }
  }
}
