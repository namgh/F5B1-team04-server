import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { ColumnLike } from '../columnlike/entities/columnlike.entity';
import { CoachColumnService } from './column.service';
import { CreateColumnInput } from './dto/createColumn.input';
import { UpdateColumnInput } from './dto/updateColumn.input';
import { CoachColumn } from './entities/column.entity';

@Resolver()
export class CoachColumnResolver {
  constructor(private readonly coachColumnService: CoachColumnService) {}
  // useGuard
  // roleGuard
  @Query(() => [CoachColumn])
  async fetchColumnList() {
    return await this.coachColumnService.findAll();
  }

  @Query(() => [CoachColumn])
  async fetchRecommendColumnList() {
    return await this.fetchRecommendColumnListArgs(1, 20);
  }

  @Query(() => [CoachColumn])
  async fetchRecommendColumnListArgs(
    @Args('pageNum') pageNum: number,
    @Args('itemcount') itemcount: number,
  ) {
    return await this.coachColumnService.findRecommendColumnList({
      pageNum,
      itemcount,
    });
  }

  @Query(() => [CoachColumn])
  async fetchHighHitColumnList() {
    return this.fetchHighHitColumnListArgs(1, 20);
  }

  @Query(() => [CoachColumn])
  async fetchHighHitColumnListArgs(
    @Args('pageNum') pageNum: number,
    @Args('itemcount') itemcount: number,
  ) {
    return await this.coachColumnService.findHighHitColumnList({
      pageNum,
      itemcount,
    });
  }

  @Mutation(() => CoachColumn)
  async increaseColumnHit(@Args('columnId') columnId: string) {
    return await this.coachColumnService.increaseHit({ columnId });
  }

  @Query(() => CoachColumn)
  async fetchDetailColumn(@Args('columnId') columnId: string) {
    return await this.coachColumnService.findColumn({ columnId });
  }

  //---------login user only-------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [CoachColumn])
  async fetchMyColumn(@CurrentUser() currentUser: ICurrentUser) {
    return await this.coachColumnService.findMyColumn({ currentUser });
  }

  async uploadColumnFile() {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CoachColumn)
  async createColumn(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createColumnInput') createColumnInput: CreateColumnInput,
  ) {
    return await this.coachColumnService.create({
      currentUser,
      createColumnInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CoachColumn)
  async updateColumn(
    @Args('columnId') columnId: string,
    @Args('updateColumnInput') updateColumnInput: UpdateColumnInput,
  ) {
    return await this.coachColumnService.update({
      columnId,
      updateColumnInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteColumn(@Args('columnId') columnId: string) {
    return await this.coachColumnService.delete({ columnId });
  }
}
