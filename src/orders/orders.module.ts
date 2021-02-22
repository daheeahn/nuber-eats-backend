import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant])],
  providers: [OrderResolver, OrdersService],
})
export class OrdersModule {}
