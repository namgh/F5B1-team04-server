import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import axios from 'axios';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { Roles } from 'src/common/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { IamportService } from '../iamport/iamport.service';
import { Role } from '../user/entities/user.entity';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionService } from './pointTransaction.service';

@Resolver()
export class PointTransactionResolver {
  constructor(
    private readonly pointTransactionService: PointTransactionService,

    private readonly iamportService: IamportService,
  ) {}

  @Roles(Role.USER)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Query(() => [PointTransaction])
  async fetchMyPointHistory(@CurrentUser() currentUser: ICurrentUser) {
    return await this.pointTransactionService.findMyPointHistory({
      currentUser,
    });
  }

  @Roles(Role.USER)
  @UseGuards(GqlAuthAccessGuard, UseGuards)
  @Mutation(() => PointTransaction)
  async createPointTransaction(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    //Iamport API validation
    const access_token = await this.iamportService.getImpAccessToken();
    await this.iamportService.checkPaid({ impUid, amount, access_token });

    return await this.pointTransactionService.create({
      impUid,
      amount,
      currentUser,
      access_token,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  async cancelPointTransaction(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.pointTransactionService.cancel({
      impUid,
      amount,
      currentUser,
    });
  }
}
