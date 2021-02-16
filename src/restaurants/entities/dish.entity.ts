import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { IsString, Length, IsNumber } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@InputType('DishOptionInputType', { isAbstract: true }) // 이걸 왜 해야하는지 아직 모르겠음.
@ObjectType()
class DishOption {
  @Field((type) => String)
  name: string;

  @Field((type) => [String], { nullable: true })
  choices?: string[];

  @Field((type) => Int)
  extra: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field((type) => String) // for graphql
  @Column() // for db
  @IsString() // for dto
  @Length(5) // for dto
  name: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field((type) => String)
  @Column()
  @Length(5, 140)
  description: string;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  // 기본적으로 json data를 저장한다. (DishOption이라는 entity를 만들 수도 있지만(정석), 그렇게 하기 싫어서 json 방식으로 한다.)
  // 특정 형태의 data를 저장해야할 때.
  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
