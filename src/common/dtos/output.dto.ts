import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // 각각 extends하는 곳에서도 ObjectType으로 해줘야 먹힌다.
export class MutationOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
