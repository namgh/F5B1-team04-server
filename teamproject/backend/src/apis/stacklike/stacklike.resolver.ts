import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Stack } from '../stack/entities/stack.entity';
import { StackLike } from './entities/stacklike.entity';
import { StackLikeService } from './stacklike.service';

@Resolver()
export class StackLikeResolver {
  constructor(private readonly stacklikeservice: StackLikeService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Stack])
  async fetchStacklike(@CurrentUser() currentUser: ICurrentUser) {
    return this.stacklikeservice.findstacklike({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackLike)
  async Stacktoggle(
    @Args('stackid') stackid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stacklikeservice.like({ stackid, currentUser });
  }
}
