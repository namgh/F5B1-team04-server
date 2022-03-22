import { HttpException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import axios from 'axios';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { IamportService } from '../iamport/iamport.service';
import { PointTransaction } from './entities/pointTransaction.entity';
import { PointTransactionService } from './pointTransaction.service';

@Resolver()
export class PointTransactionResolver {
  constructor(
    private readonly pointTransactionService: PointTransactionService,

    private readonly iamportService: IamportService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
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
    // await this.pointTransactionService.checkAlreadyCanceled({ impUid });
    // await this.pointTransactionService.checkHasEnoughPoint({
    //   impUid,
    //   currentUser,
    // });
    // const access_token = await this.iamportService.getImpAccessToken();
    // const cancel_amount = await this.iamportService.cancelPayment({
    //   impUid,
    //   amount,
    //   access_ token,
    // });
    // return await this.pointTransactionService.cancel({
    //   impUid,
    //   amount: cancel_amount,
    //   currentUser,
    // });
  }
}
