import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // authentication: token으로 identity 확인. = canActive에서 하는 작업.
  // authorization: user가 어떤 일 하기 전에 permission 확인. 이건 아직 안했어!
  canActivate(context: ExecutionContext) {
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
    console.log('💝 gqlContext');
    console.log(gqlContext.token);
    const user: User = gqlContext['user'];
    if (!user) {
      return false;
    }
    if (roles.includes('Any')) {
      return true;
    }
    return roles.includes(user.role);
  }
}
