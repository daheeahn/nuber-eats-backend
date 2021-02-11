import { Entity, Column } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { ObjectType, InputType, Field } from '@nestjs/graphql';

type UserRole = 'client' | 'owner' | 'delivery';

@InputType({ isAbstract: true }) // 이거 대신 OmitTYpe 쓸 때 InputType 써줘도 되지~
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column()
  @Field((type) => String)
  role: UserRole;
}
