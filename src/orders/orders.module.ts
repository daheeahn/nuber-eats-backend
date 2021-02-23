import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { OrderItem } from 'src/restaurants/entities/order-item.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrderResolver, OrdersService],
})
export class OrdersModule {}
