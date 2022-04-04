import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BlogComment } from '../blogcomment/entities/blogcomment.entity';
import { StackComment } from '../stackcomment/entities/stackcomment.entity';
import { StackCommentLike } from './entities/stackcommentlike.entity';
import { StackCommentLikeService } from './staclcommentlike.service';

@Resolver()
export class StackCommentLikeResolver {
  constructor(
    private readonly stackcommentlikeservice: StackCommentLikeService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [StackComment])
  async fetchStackcommentlike(@CurrentUser() currentUser: ICurrentUser) {
    return this.stackcommentlikeservice.findStackcommentlike({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackCommentLike)
  async Stackcommentliketoggle(
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackcommentlikeservice.like({ stackcommentid, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackCommentLike)
  async Stackcommentdisliketoggle(
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackcommentlikeservice.dislike({
      stackcommentid,
      currentUser,
    });
  }
}
