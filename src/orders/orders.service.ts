import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderItem } from 'src/restaurants/entities/order-item.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
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

      // items.forEach(async (item) => { // 안에서 return { ok: false }를 할 수 없다. => for of 사용
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          // abort this whole thing
          // forEach는 for of처럼 안에서 return 못한다. 그래서 for of 사용한다.
          return {
            ok: false,
            error: 'Dish not found',
          };
        }
        // item.options
        // dish.options
        console.log(`Dish price: ${dish.price}`);
        for (const itemOption of item.options) {
          // db와 일치하는 dish option을 찾는다.
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              console.log(`${dishOption.name}: $USD + ${dishOption.extra}`);
            } else {
              // option에 extra가 없다면 choices 안의 extra를 봐야해
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  console.log(
                    `${dishOptionChoice.name}: $USD + ${dishOptionChoice.extra}`,
                  );
                }
              }
            }
          }
        }

        // await this.orderItems.save(
        //   this.orderItems.create({
        //     dish,
        //     options: item.options,
        //   }),
        // );
      }

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
