import { Module, Global } from '@nestjs/common';
import { PUB_SUB } from 'src/common/common.constants';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubSub, // 바로 new PubSub() 해줘도 됨.
    },
  ],
  exports: [PUB_SUB], // Global이라 하더라도 export는 꼭 해줘야 딴곳에서 쓸 수 있어!
})
export class CommonModule {}
