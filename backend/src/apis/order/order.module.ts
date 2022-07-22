import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistory } from './entities/order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistory])],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
