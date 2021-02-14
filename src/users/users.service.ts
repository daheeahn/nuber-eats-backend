import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreatedAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
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
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      await this.verifications.save(
        this.verifications.create({
          // code: 121212, // verification BeforeInsert를 통해 만들어진다.
          user,
        }),
      );
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

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    // 1. user가 있는지 없는지 체크 안한다. but, 우리는 user 없으면 여기 오지 않기 때문에 괜찮다.
    // 빠르다: Executes fast and efficient UPDATE query.
    // this.users.update({ id: userId }, { email, password });

    // 2. { ...input } 해야 password 안오면 password는 수정안하기 때문.
    // not editProfileInput but { ...editProfileInput }
    // return this.users.update(userId, { ...editProfileInput }); // 이거 쓰면~

    // 3. BeforeUpdate해도 패스워드 해시화가 그래도 안된다.
    // 왜? .update: 우리가 직접 entity update하는게 아니다. 그냥 db에 쿼리만 보내는 것이다.
    // 그래서 BeforeUpdate는 특정 entity를 업데이트해야 한다. .update는 그냥 그 entity가 있길 바라면서 쿼리만 보내는거야.
    // => save해야해
    // return this.users.update(userId, { ...editProfileInput });

    // Saves all given entities in the database. If entities do not exist in the database then inserts, otherwise updates.
    // entity가 존재하면 update, 존재하지 않으면 insert
    // 우리가 직접 entity 업데이트하고있어.
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    // 이제 BeforeUpdate가 먹힌다~ entity를 직.접. 업데이트해줘야 한다.
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne(
      { code },
      { relations: ['user'] }, // 이거 없으면 user 정보는 없다. 이렇게 직접 불러와줘야 한다.
    );
    if (verification) {
      // .user = undefined. 자동으로 불러와져서 relations: ['user']를 해줘야 함
      console.log('verification', verification);
      verification.user.verified = true;
      this.users.save(verification.user); // 패스워드 또 해시화됨. 에러!!!! 다음 강의에서 고침.
    }
    return false;
  }
}
