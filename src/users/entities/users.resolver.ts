import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './users.entity';
import { UsersService } from './users.service';
import {
  CreatedAccountOutput,
  CreateAccountInput,
} from '../dtos/create-account.dto';
import { LoginOutput, LoginInput } from '../dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from '../dtos/user-profile.dto';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi(): boolean {
    return true;
  }

  @Mutation((returns) => CreatedAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreatedAccountOutput> {
    try {
      return this.usersService.createAccount(createAccountInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  // @Query((returns) => User)
  // @UseGuards(AuthGuard) // 이렇게 추가해주는 것보다 더 좋은 방법 있다. (추후에 다시~!)
  // // me(@Context() context) { // 이렇게 해줘도 되는데, 바로 user 받도록 decorator를 만들어보자.
  // me(@AuthUser() authUser) {}

  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw Error(); // go to catch
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User Not Found.',
      };
    }
  }
}
