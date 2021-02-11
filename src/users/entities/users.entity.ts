import { Entity, Column, BeforeInsert } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  ObjectType,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

enum UserRole {
  Owner,
  Client,
  Delivery,
}
registerEnumType(UserRole, { name: 'UserRole' }); // graphql에 enum 등록해줘야함.

@InputType({ isAbstract: true }) // 이거 대신 OmitTYpe 쓸 때 InputType 써줘도 되지~
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    // this.users.save 전에 create했을 때 이미 우리는 instance를 가지고 있다. (이 때 생성된다.)
    // create는 단지 entity를 만들 뿐이야. 이 entity를 save하기 전에 hashPassword가 실행되는거고. BeforeInsert
    // this.password에 접근할 수 있다. 그래서 해시!
    try {
      // throw new Error('oppp'); // for test
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.log('hash password', error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log('check password', error);
      throw new InternalServerErrorException();
    }
  }
}
