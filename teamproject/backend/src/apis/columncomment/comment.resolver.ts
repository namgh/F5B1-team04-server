import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ColumnCommentService } from './comment.service';
import { ColumnComment } from './entities/columncomment.entity';

@Resolver()
export class ColumnCommentResolver {
  constructor(private readonly columnCommentService: ColumnCommentService) {}

  @Query(() => [ColumnComment])
  async fetchColumnCommentList(
    @Args('columnId') columnId: string, //
  ) {
    return await this.columnCommentService.findAll({ columnId });
  }

  async fetchMyColumnComment() {} //columnid

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ColumnComment)
  async createColumnComment(
    @Args('columnId') columnId: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.columnCommentService.create({
      columnId,
      currentUser,
      contents,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ColumnComment)
  async updateColumnComment(
    @Args('commentId') commentId: string,
    @Args('contents') contents: string,
  ) {
    return await this.columnCommentService.update({
      commentId,
      contents,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteColumnComment(
    @Args('columnId') columnId: string,
    @Args('commentId') commentId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.columnCommentService.delete({
      commentId,
      columnId,
      currentUser,
    });
  }
}
