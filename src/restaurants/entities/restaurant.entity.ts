import { ObjectType, Field, InputType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  OneToMany,
} from 'typeorm';
import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entities/users.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

// entity에서 InputType 안써주고 이렇게 할 수도 있는데 추천은 X

// 이 클래스 하나로 DB에 저장되는 실제 데이터 형식을 만들 수 있다. 아래 2개의 decorator만 있으면!
@InputType('RestaurantInputType', { isAbstract: true }) // 스키마에 포함되지 않길 원한다는 뜻. 이걸 어디선가 복사해서 쓴다는 뜻. 직접 쓰는게 아니라 어디로 확장시킨다는 뜻.
@ObjectType() // for graphql automatic schema
@Entity() // for db (typeorm)
export class Restaurant extends CoreEntity {
  @Field((type) => String) // for graphql
  @Column() // for db
  @IsString() // for dto
  @Length(5) // for dto
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg?: string;

  @Field((type) => String, { defaultValue: '강남' })
  @Column() // 여기에 default: 안써도 되긴 하네~ 위처럼 Column에만 default: true를 해줘도 되고(graphql에는 nullable), 여기처럼 graphql에만 해줘도 되고 상관없나보다
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true }) // 카테고리를 지워도 여기는 null로 남아있을 수 있도록.
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.restaurant)
  orders: Order[];

  // graphql에서는 알고싶지 않아서 @Field 안씀.
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => [Dish], { nullable: true })
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];
}
