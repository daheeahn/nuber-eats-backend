import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from 'src/users/entities/users.entity';
import { Category } from './entities/category.entity';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { AllCategoriesOutput } from './dtos/all-categories.dto';

@Injectable()
export class RestaurantService {
  // Restaurant entity의 repository를 inject함
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    // @InjectRepository(Category) // 이제 custom repository라 필요없음.
    private readonly categories: CategoryRepository, // custom repository
  ) {
    // console.log('hello how are'.replace(/ /g, '-')); // 그냥 ' ', '-'하면 맨 처음 빈칸만 적용된다.
  }

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    // create vs save on typeorm
    // create return Entity (db 반영 X)
    // save return Promise<Entity> (db 반영 O)
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput); // js에서만 존재하고 실제 db에 저장되진 않는다.
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;

      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      // findOneOrFail: 못찾으면 에러를 뿜는다.
      const restaurant = await this.restaurants.findOne(
        editRestaurantInput.restaurantId,
        {
          // relations: ['owner']은 모든 object를 가져오지만 이건 id만 가져와서 더 빠르겠지!
          // loadRelationIds: true
          // but, ownerId를 만들었기 때문에 필요X
        },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You cannot edit a restaurant that you donnot own',
        };
      }
      // defensive programming: 확실히 이 레스토랑의 오너다!

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurants.save([
        // 업데이트할 땐 array를 넣어야 한다.
        {
          id: editRestaurantInput.restaurantId, // id 보내지 않으면 entity를 새로 만든다.
          ...editRestaurantInput,
          ...(category && { category }), // category가 존재할 때만!
        },
      ]);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: 'You cannot delete a restaurant that you donnot own',
        };
      }

      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete Restaurant',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      console.log('all categories error', error);
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }
}
