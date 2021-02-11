import { PickType, ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';
import { MutationOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType() // MutationOutput에서는 안먹힌다.
export class CreatedAccountOutput extends MutationOutput {}
