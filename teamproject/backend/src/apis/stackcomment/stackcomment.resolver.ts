import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { StackComment } from './entities/stackcomment.entity';
import { StackCommentService } from './stackcomment.service';

@Resolver()
export class StackCommentResolver {
  constructor(private readonly stackCommentService: StackCommentService) {}

  @Query(() => StackComment)
  async fetchAllBlogcomment(@Args('stackid') stackid: string) {
    return this.stackCommentService.findAll({
      stackid,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackComment)
  async createBlogComment(
    @Args('stackid') stackid: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackCommentService.create({
      stackid,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackComment)
  async updateBlogComment(
    @Args('stackid') stackid: string,
    @Args('contents') contents: string,
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackCommentService.update({
      stackcommentid,
      stackid,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackComment)
  async deleteBlogComment(
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackCommentService.delete({
      stackcommentid,
    });
  }
}