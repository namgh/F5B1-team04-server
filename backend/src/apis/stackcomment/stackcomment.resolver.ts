import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { StackComment } from './entities/stackcomment.entity';
import { StackCommentService } from './stackcomment.service';

@Resolver()
export class StackCommentResolver {
  constructor(private readonly stackCommentService: StackCommentService) {}

  @Query(() => [StackComment])
  async fetchAllStackcommentAll(@Args('stackid') stackid: string) {
    return this.stackCommentService.findAll({
      stackid,
    });
  }

  @Query(() => [StackComment])
  async fetchStackCommentorderbycreate(@Args('stackid') stackid: string) {
    return this.stackCommentService.fetchStackCommentorderbycreate({ stackid });
  }

  @Query(() => [StackComment])
  async fetchStackCommentorderbylike(@Args('stackid') stackid: string) {
    return this.stackCommentService.fetchStackCommentorderbylike({ stackid });
  }

  @Query(() => StackComment)
  async fetchStackCommentbyStackId(
    @Args('stackcommentid') stackcommentid:string,
  ){
    return await this.stackCommentService.fetchStackCommentbyStackId({stackcommentid})
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StackComment)
  async createStackComment(
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
  async updateStackComment(
    @Args('contents') contents: string,
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackCommentService.update({
      stackcommentid,
      contents,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteStackComment(
    @Args('stackcommentid') stackcommentid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.stackCommentService.delete({
      stackcommentid,
    });
  }
}
