import { InputType, Field, ArgsType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { IsString, IsBoolean, Length } from 'class-validator';

// InputType is One Object
// ArgsType is 분리된 값들을 args로 넘길 수 있게 해줌. => object로 안보내도 됨
// @ArgsType()
@InputType() // dto, schema, db 통합 위해 maaped type 쓰면 ArgsType 안되기 때문에
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType, // Restaurant는 ObjectType인데, OmitType을 쓸 때 필요한 InputType일 필요가 있기 때문에.
) {}
