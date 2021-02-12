import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  // authentication: token으로 identity 확인. = canActive에서 하는 작업.
  // authorization: user가 어떤 일 하기 전에 permission 확인. 이건 아직 안했어!
  canActivate(context: ExecutionContext) {
    // request를 계속 진행할건지 말건지 결정. request의 user가 유효할 수도 있고 아닐 수도 있으니 guard가 필요한거.
    // console.log('context');
    // console.log(context);
    // context가 http로 되어있는데, graphql로 바꿔야함.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // console.log('gqlContext');
    // console.log(gqlContext);
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
