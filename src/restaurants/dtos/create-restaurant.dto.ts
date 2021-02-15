import { InputType, OmitType, ObjectType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

// InputType is One Object
// ArgsType is 분리된 값들을 args로 넘길 수 있게 해줌. => object로 안보내도 됨
// @ArgsType()
@InputType() // dto, schema, db 통합 위해 maaped type 쓰면 ArgsType 안되기 때문에
export class CreateRestaurantInput extends OmitType(
  Restaurant,
  ['id', 'category', 'owner'],
  InputType, // Restaurant는 ObjectType인데, OmitType을 쓸 때 필요한 InputType일 필요가 있기 때문에.
) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
