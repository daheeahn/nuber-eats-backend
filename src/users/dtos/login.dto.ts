import { ObjectType, Field, PickType, InputType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType() // 여기도 써줘야 먹힌다~ MutationOutput에도 있어야 하고.
export class LoginOutput extends MutationOutput {
  // 또한 token을 return할거지~
  @Field((type) => String)
  token: string;
}
