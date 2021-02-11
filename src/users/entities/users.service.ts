import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreatedAccountOutput,
} from '../dtos/create-account.dto';
import { LoginInput, LoginOutput } from '../dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreatedAccountOutput> {
    try {
      // check new user
      const exists = await this.users.findOne({ email });
      if (exists) {
        // return error
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return {
        ok: true,
      };
    } catch (error) {
      // make error
      console.log('createAccount e', error);
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }

    // where: create user & hash the password
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // find the user with the email
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // check if the password is correct
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // make a JWT and give it to the user
      // later
      return {
        ok: true,
        token: 'lalala',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
