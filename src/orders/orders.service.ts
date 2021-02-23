import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/users.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderItem } from 'src/restaurants/entities/order-item.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';

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

      // items.forEach(async (item) => { // 안에서 return { ok: false }를 할 수 없다. => for of 사용
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
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
        let dishFinalPrice = dish.price;
        console.log(`Dish price: ${dish.price}`);
        for (const itemOption of item.options) {
          // db와 일치하는 dish option을 찾는다.
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              console.log(`${dishOption.name}: $USD + ${dishOption.extra}`);
              dishFinalPrice += dishOption.extra;
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
                  dishFinalPrice += dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice += dishFinalPrice;
        console.log(`Final price: ${orderFinalPrice}`);
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }

      await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );

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

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    let orders: Order[];
    try {
      const { role } = user;
      if (role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && {
              status,
            }),
          },
        });
      } else if (role === UserRole.Delivery) {
        orders = await this.orders.find({
          where: {
            driver: user,
            ...(status && {
              status,
            }),
          },
        });
      } else if (role === UserRole.Owner) {
        const restaurants = await this.restaurants.find({
          where: {
            owner: user,
          },
          relations: ['orders'],
        });
        // 모든 레스토랑에 order가 있진 않을테니까 flat을 해준거.
        // flat => Array를 하나 벗겨낸다.
        orders = restaurants.map((r) => r.orders).flat(1);
        if (status) {
          orders = orders.filter((order) => order.status === status);
        }
      }
      console.log(orders.length, orders);

      return {
        ok: true,
        orders,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found',
        };
      }
      if (
        (user.role === UserRole.Client && order.customerId !== user.id) || // Client
        (user.role === UserRole.Delivery && order.driverId !== user.id) || // Driver
        (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) // Owner
      ) {
        return {
          ok: false,
          error: 'You cannot see that',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch (error) {
      console.log('get order error', error);
      return {
        ok: false,
        error: 'Could not load order',
      };
    }
  }
}
