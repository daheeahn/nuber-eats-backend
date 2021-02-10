import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
// import { Query } from '@nestjs/common'; // 이거 아님!!!!!!!!!!!!1

@Resolver((of) => Restaurant) // 꼭 이렇게 안해도 됨. 그냥 이름 붙여주는거. 직관성 높아짐.
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Query는 1번째 argument로 'function'이 필요하다. () => Boolean = reutnrs => Boolean
  // @Query((returns) => Boolean) // => Boolean is for graphql (required)
  // isPizzaGood(): boolean {
  //   // : Boolean is for typescript (optional)
  //   return true;
  // }

  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

  @Mutation((returns) => Boolean)
  createRestaurant(
    // @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantDto, // InputType 사용 시
    @Args() createRestaurantInput: CreateRestaurantDto, // ArgsType 사용 시 (이러면 자동으로 각자 분리된다.)
  ): boolean {
    console.log('createRestaurantInput', createRestaurantInput);
    return true;
  }
}
