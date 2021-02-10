import { Resolver, Query, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
// import { Query } from '@nestjs/common'; // 이거 아님!!!!!!!!!!!!1

@Resolver((of) => Restaurant) // 꼭 이렇게 안해도 됨. 그냥 이름 붙여주는거. 직관성 높아짐.
export class RestaurantResolver {
  // Query는 1번째 argument로 'function'이 필요하다. () => Boolean = reutnrs => Boolean
  @Query((returns) => Boolean) // => Boolean is for graphql (required)
  isPizzaGood(): Boolean {
    // : Boolean is for typescript (optional)
    return true;
  }

  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    console.log('veganOnly', veganOnly);
    return [];
  }
}
