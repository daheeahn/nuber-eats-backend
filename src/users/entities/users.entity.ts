import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
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

  // 쿼리 실행마다 이 column은 포함하지 X.
  // 이렇게 해야 this.users.save(user)할 때 password가 user에 없고,
  // BeforeUpdate할 때 password가 없기 때문에 if (this.password) 조건에 맞지도 않음. 굳.
  @Column({ select: false })
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean; // email이 인증됐는지 안됐는지

  @BeforeInsert()
  @BeforeUpdate() // update할 때도~! // 우리가 직접 entity update하는게 아니다. 그냥 db에 쿼리만 보내는 것이다. 그래서 BeforeUpdate는 특정 entity를 업데이트해야 한다. .update는 그냥 그 entity가 있길 바라면서 쿼리만 보내는거야. => save해야해
  async hashPassword(): Promise<void> {
    // this.users.save 전에 create했을 때 이미 우리는 instance를 가지고 있다. (이 때 생성된다.)
    // create는 단지 entity를 만들 뿐이야. 이 entity를 save하기 전에 hashPassword가 실행되는거고. BeforeInsert
    // this.password에 접근할 수 있다. 그래서 해시!

    // password가 있을 때만 해시한다. (verifyEmail에선 해시하면 안되기때문.)
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log('hash password', error);
        throw new InternalServerErrorException();
      }
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
