import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      // items를 가지고 OrderItems를 만들어줄거야. 그리고 order를 만들어줄거야.
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          // items,
        }),
      );
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!
      // TODO: 아직 미완성!

      return {
        ok: true,
      };
    } catch (error) {
      console.log('create order error', error);
      return {
        ok: false,
        error: 'Could not create order',
      };
    }
  }
}
