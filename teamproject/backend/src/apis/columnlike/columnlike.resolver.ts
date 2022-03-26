import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ColumnlikeService } from './columnlike.service';
import { ColumnLike } from './entities/columnlike.entity';

@Resolver()
export class ColumnlikeResolver {
  constructor(private readonly columnlikeService: ColumnlikeService) {}
  // columnlike : status/ column(comment) / isLike(Dislike)
  // column : likecount
  // comment: likecount
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ColumnLike)
  async LikeColumn(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('columnId') columnId: string,
  ) {
    return await this.columnlikeService.likeToggle({ columnId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ColumnLike)
  async DislikeColumn(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('columnId') columnId: string,
  ) {
    return await this.columnlikeService.dislikeToggle({
      columnId,
      currentUser,
    });
  }
}
