import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderOutput, CreateOrderInput } from './dtos/create-order.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import { Role } from 'src/auth/role.decorator';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderOutput, GetOrderInput } from './dtos/get-order.dto';
import { EditOrderOutput, EditOrderInput } from './dtos/edit-order.dto';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => CreateOrderOutput)
  @Role(['Client'])
  createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Role(['Any'])
  getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => GetOrderOutput)
  @Role(['Any'])
  getOrder(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrder(user, getOrderInput);
  }

  @Mutation((returns) => EditOrderOutput)
  @Role(['Any'])
  editOrder(
    @AuthUser() user: User,
    @Args('input') editOrderInput: EditOrderInput,
  ): Promise<EditOrderOutput> {
    return this.ordersService.editOrder(user, editOrderInput);
  }

  @Mutation((returns) => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    // payload에는 resolver 함수의 이름이 있어야 한다. 트리거 이름이 아니다.
    await this.pubSub.publish('hotPotatos', {
      readyPotato: potatoId,
    });
    return true;
  }

  @Subscription((returns) => String, {
    // filter: (payload, variables, context) => {
    filter: ({ readyPotato }, { potatoId }, context) => {
      // console.log('payload', payload);
      // console.log('variables', variables);
      // console.log('context', context);
      return readyPotato === potatoId;
    },
    // 사용자가 받는 update 알림의 형태를 바꿔준다. output을 바꿔준다.
    resolve: ({ readyPotato }) =>
      `Your potato with the id ${readyPotato} is ready!`, // 원래 이걸 publish('hotPotatos', here) 에서 here자리에 넣었었잖아!
  })
  @Role(['Any'])
  readyPotato(@AuthUser() user: User, @Args('potatoId') potatoId: number) {
    // console.log('😍 user');
    // console.log(user);
    // GraphQL상으로는 string을 return하지만, 실제로는 asyncIterator을 return할거야. 이게 규칙이다!
    return this.pubSub.asyncIterator('hotPotatos');
  }
}
