import { v4 as uuidv4 } from 'uuid';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from './users.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' }) // cascade: user를 삭제하면 해당 verification도 삭제된다.
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
