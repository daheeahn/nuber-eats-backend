import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreatedAccountOutput,
} from '../dtos/create-account.dto';
import { LoginInput, LoginOutput } from '../dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService, // class 타입만 보고 imports에서 알아서 찾아준다.
  ) {
    // console.log(this.config.get('PRIVATE_KEY')); // works!
    // console.log('jwt service in users.service', jwtService.hello()); // works!
  }

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
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }
}
