import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/gql-role.guard';
import { Roles } from 'src/common/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Role } from '../user/entities/user.entity';
import { AnswerService } from './answer.service';
import { CreateAnswerInput } from './dto/createanswer.input';
import { UpdateAnswerInput } from './dto/updateanswer.input';
import { Answer } from './entities/answer.entity';

@Resolver()
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Query(() => [Answer])
  async goodEvalAnswerList(@Args('itemCount') itemCount: number) {
    return await this.answerService.findAnswerListOrderByHighScoreDesc({
      itemCount,
    });
  }

  @Query(() => [Answer])
  async goodEvalAnswerListPerCoach(
    @Args('itemCount') itemCount: number,
    @Args('coachId') coachId: string,
  ) {
    return await this.answerService.findAnswerListOrderByHigthScorePerCoach({
      coachId,
      itemCount,
    });
  }

  @Query(() => [Answer])
  async fetchQnACoachingList() {
    return await this.answerService.findQnACoachingListForClient();
  }

  @Query(() => [Answer])
  async fetchQnACoachListPerCoach(@Args('coachId') coachId: string) {
    return await this.answerService.findQnAListPerCoach({ coachId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Answer])
  async myCoachingListHasAnswer(@CurrentUser() currentUser: ICurrentUser) {
    return await this.answerService.findMyHasAnswerCoaching({ currentUser });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Answer])
  async coachAnsweredListonlycoach(@CurrentUser() currentUser: ICurrentUser) {
    return await this.answerService.findAllCoachAnswercoach({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Answer])
  async coachAnsweredList(@CurrentUser() currentUser: ICurrentUser) {
    return await this.answerService.findAllCoachAnswer();
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Answer)
  async createCoachAnswer(
    @Args('questionId') questionId: string,
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return await this.answerService.create({ questionId, createAnswerInput });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Answer)
  async updateCoachAnswer(
    @Args('answerId') answerId: string,
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return await this.answerService.update({ answerId, updateAnswerInput });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteCoachAnswer(@Args('answerId') answerId: string) {
    return await this.answerService.delete({ answerId });
  }

  @Query(() => [Answer])
  async fetchanswersearch(@Args('search') search: string) {
    return this.answerService.fetchanswersearch({ search });
  }
}
