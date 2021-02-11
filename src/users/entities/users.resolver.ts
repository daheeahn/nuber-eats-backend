import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './users.entity';
import { UsersService } from './users.service';
import {
  CreatedAccountOutput,
  CreateAccountInput,
} from '../dtos/create-account.dto';

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
      const { ok, error } = await this.usersService.createAccount(
        createAccountInput,
      );
      if (error) {
        return {
          ok,
          error,
        };
      }
      return {
        ok,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(returns => )
}
