import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { OrderStatus, Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class GetOrdersInput {
  @Field((type) => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class GetOrdersOutput extends CoreOutput {
  @Field((type) => [Order], { nullable: true })
  orders?: Order[];
}
