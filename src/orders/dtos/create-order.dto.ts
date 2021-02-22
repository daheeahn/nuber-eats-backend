import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderItemOption } from 'src/restaurants/entities/order-item.entity';

@InputType()
class CreateOrderItemInput {
  @Field((type) => Int)
  dishId: number;

  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
  @Field((type) => Int)
  restaurantId: number;

  @Field((type) => [CreateOrderItemInput])
  items: CreateOrderItemInput[]; // OrderItem[]으로 하면 dish전체가 필요하니까! dishId로 바꾼 CreateOrderItemInput을 이용한거야.
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
