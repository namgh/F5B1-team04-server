import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { AnswerlikeService } from './answerlike.service';
import { AnswerLike } from './entities/answerlike.entity';

@Resolver()
export class AnswerlikeResolver {
  constructor(private readonly answerlikeService: AnswerlikeService) {}
  //role-buyer
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => AnswerLike)
  async likeAnswerToggle(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('answerId') answerId: string,
  ) {
    return await this.answerlikeService.likeToggle({ answerId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => AnswerLike)
  async dislikeAnswerToggle(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('answerId') answerId: string,
  ) {
    return await this.answerlikeService.dislikeToggle({
      answerId,
      currentUser,
    });
  }
}
