import { InputType, PartialType, ArgsType, Field } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

// PartialType(Restaurant)

@InputType() // resolver에서 꼭 @Args('input~') 네이밍
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

@ArgsType() // resolver에서 @Args('input~')으로 명시 안해주고 @Args() 하면 자동으로 안에 내용물을 풀어줌
export class UpdateRestaurantDto {
  // UpdateRestaurantInputType만 쓰면 id도 optional이 되기 때문
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
