import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { IsString, Length, IsNumber } from 'class-validator';
import { Restaurant } from './restaurant.entity';

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

  @Field((type) => String)
  @Column()
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
}
