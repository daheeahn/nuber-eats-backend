import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class RestaurantService {
  // Restaurant entity의 repository를 inject함
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    // create vs save on typeorm
    // create return Entity (db 반영 X)
    // save return Promise<Entity> (db 반영 O)
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput); // js에서만 존재하고 실제 db에 저장되진 않는다.
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch (e) {
      console.log('create e', e);
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }
}
