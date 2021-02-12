import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './users.entity';
import { UsersService } from './users.service';
import {
  CreatedAccountOutput,
  CreateAccountInput,
} from '../dtos/create-account.dto';
import { LoginOutput, LoginInput } from '../dtos/login.dto';

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

  @Query((returns) => User)
  me(@Context() context): User {
    // console.log(context);

    // this is not good!!!!!
    if (!context.user) {
      return;
    } else {
      return context.user;
    }
  }
}
