import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from '../dto/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput) {
    try {
      // check new user
      const exists = await this.users.findOne({ email });
      if (exists) {
        // make error
        return; // later
      }
      await this.users.save(this.users.create({ email, password, role }));
      return true;
    } catch (error) {
      // make error
      console.log('createAccount e', error);
      return; // later
    }

    // where: create user & hash the password
  }
}
