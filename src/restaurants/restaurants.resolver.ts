import { Resolver, Query } from '@nestjs/graphql';
// import { Query } from '@nestjs/common'; // 이거 아님!!!!!!!!!!!!1

@Resolver()
export class RestaurantResolver {
  // Query는 1번째 argument로 'function'이 필요하다. () => Boolean = reutnrs => Boolean
  @Query((returns) => Boolean) // => Boolean is for graphql (required)
  isPizzaGood(): Boolean {
    // : Boolean is for typescript (optional)
    return true;
  }
}
