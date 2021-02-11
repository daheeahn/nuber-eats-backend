import { Injectable } from '@nestjs/common';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  // Restaurant entity의 repository를 inject함
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // create vs save on typeorm
    // create return Entity (db 반영 X)
    // save return Promise<Entity> (db 반영 O)
    const newRestaurant = this.restaurants.create(createRestaurantDto); // js에서만 존재하고 실제 db에 저장되진 않는다.
    return this.restaurants.save(newRestaurant);
  }
}
