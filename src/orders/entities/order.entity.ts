import {
  InputType,
  ObjectType,
  Field,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/users.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { OrderItem } from 'src/restaurants/entities/order-item.entity';
import { IsNumber, IsEnum } from 'class-validator';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  // ManyToMany가 아니네?
  // 많은 order는 한 명의 user를 가진다..
  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL', // user가 지워진다고해서 order가 지워지는건 원하지 x
    nullable: true,
  })
  customer?: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field((type) => User, { nullable: true }) // 바로 배달원이 지정되지 않기 떄문
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL', // user가 지워진다고해서 order가 지워지는건 원하지 x
    nullable: true,
  })
  driver?: User;

  @RelationId((order: Order) => order.driver)
  driverId: number;

  @Field((type) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  restaurant?: Restaurant;

  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem)
  @JoinTable()
  // order로부터 몇 개의 dish를 주문했는지 알아야해. 음식을 여러 개 주문할 수 있으니까.
  // 그런데 그게 Dish일 필요는 없다. OrderItem이면 된다.
  items: OrderItem[];

  @Field((type) => Float, { nullable: true })
  @Column({ nullable: true })
  @IsNumber()
  total?: number;

  @Field((type) => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
