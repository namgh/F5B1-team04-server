import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Role } from '../user/entities/user.entity';
import { OrderHistory } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OrderHistory)
  async createAnswerOrder(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('answerId') answerId: string,
  ) {
    return await this.orderService.create({ currentUser, answerId });
  }

  @Roles(Role.ADMIN)
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => OrderHistory)
  async cancelAnswerOrder(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('answerId') answerId: string,
  ) {
    return await this.orderService.cancel({ currentUser, answerId });
  }
}
