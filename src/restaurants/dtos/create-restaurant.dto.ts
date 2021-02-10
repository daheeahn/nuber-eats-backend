import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { IsString, IsBoolean, Length } from 'class-validator';

// InputType is One Object
// ArgsType is 분리된 값들을 args로 넘길 수 있게 해줌. => object로 안보내도 됨
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((type) => String)
  @IsString()
  address: string;

  @Field((type) => String)
  @IsString()
  ownerName: string;
}
