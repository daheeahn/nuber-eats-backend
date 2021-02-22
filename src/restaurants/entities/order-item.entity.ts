import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish, DishOption, DishChoice } from './dish.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItemOption extends CoreEntity {
  @Field((type) => String)
  name: string;

  @Field((type) => DishChoice, { nullable: true })
  choice: DishChoice;

  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  // Order에서 restaurant는 Restaurant에서 orders를 어떻게 가져와야하는지 생각했지만, 여기는 그럴 필요가 없다.
  // 왜? => 항상 반대의 관계에서 어떻게 되는지 명시해줄 필요는 없다. 항상 필요한건 X (inverseSide가 항상 필요하진 X)
  // inverseSide: 반대쪽 관계에서 접근을 하고 싶을 때만 해주면 됨.
  // inverseSide: restaurant.orders가 필요했었지! 그래서 inverseSide 자리에 restaurant.orders가 들어가있었지!
  // 근데 Dish쪽에서 orderItem으로 접근을 원하지 않아서 ㄱㅊ
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;

  // option은 언제 없어질지 모르니까 그때그때 저장하는거야.
  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
