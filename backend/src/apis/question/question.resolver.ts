import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/gql-role.guard';
import { Roles } from 'src/common/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Role } from '../user/entities/user.entity';
import { CreateQuestionInput } from './dto/createquestion.input';
import { UpdateQuestionInput } from './dto/updatequestion.input';
import { Question } from './entities/question.entity';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Query(() => [Question])
  async fetchQuestionList() {
    return await this.questionService.findAllQuestionList();
  }

  @Query(() => [Question])
  async fetchQuestionListPerCoach(@Args('coachId') coachId: string) {
    return await this.questionService.findAllCoachsQuestionList({ coachId });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Query(() => [Question])
  async fetchCoachQuestionList(@CurrentUser() currentUser: ICurrentUser) {
    return await this.questionService.findAllCoachQuestion({ currentUser });
  }

  // @Query(() => Question)
  // async fetchHasAnswerQuestionList(@Args('coachId') coachId: string) {
  //   return await this.questionService.findAllHasAnswerQuestion({ coachId });
  // }

  // @Query(() => Question)
  // async fetchHasNoAnswerQuestionList(@Args('coachId') coachId: string) {
  //   return await this.questionService.findAllHasNoAnsweredQuestion({ coachId });
  // }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Question])
  async fetchMyQuestionList(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.questionService.findAllMyQuestion({ currentUser });
  }

  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => Question)
  // async fetchMyHasAnswerQuestionList(
  //   @CurrentUser() currentUser: ICurrentUser, //
  // ) {
  //   return await this.questionService.findMyHasAnswerQuestion({ currentUser });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => Question)
  // async fetchMyHasNoAnswerQuestionList(
  //   @CurrentUser() currentUser: ICurrentUser, //
  // ) {
  //   return await this.questionService.findMyHasNoAnswerQuestion({
  //     currentUser,
  //   });
  // }

  @Query(() => Question)
  async fetchQuestion(@Args('questionId') questionId: string) {
    return await this.questionService.findQuestion({ questionId });
  }

  @Roles(Role.USER)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Question)
  async createCoachQuestion(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('coachId') coachId: string,
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return await this.questionService.create({
      coachId,
      currentUser,
      createQuestionInput,
    });
  }

  // @Query(() => [Question])
  // async fetchSearchArgsQuestion(@Args('search') search: string) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Question)
  async updateCoachQuestion(
    @Args('questionId') questionId: string,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return await this.questionService.update({
      questionId,
      updateQuestionInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteCoachQuestion(@Args('questionId') questionId: string) {
    return await this.questionService.delete({ questionId });
  }

  @Query(() => [Question])
  async fetchquestionsearch(@Args('search') search: string) {
    return this.questionService.fetchquestionsearch({ search });
  }
}
