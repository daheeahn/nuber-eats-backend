import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  ObjectType,
  PickType,
  PartialType,
  InputType,
  ArgsType,
} from '@nestjs/graphql';
import { User } from '../entities/users.entity';

// PartialType => Pick한 email, password를 optional하게 만들어줌.
@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
