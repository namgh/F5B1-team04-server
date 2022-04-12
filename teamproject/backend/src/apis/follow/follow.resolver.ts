import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Follow)
  async createFollow(
    @Args('followUserId') followUserId: String,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return await this.followService.createfollow({ currentUser, followUserId });
  }

  //userid를 팔로우한사람 찾기
  @Query(() => [Follow])
  async fetchFollower(@Args('userId') userId: String) {
    return this.followService.fetchFollower({ userId });
  }

  //userid가 팔로우한사람 찾기
  @Query(() => [Follow])
  async fetchFollowing(@Args('userId') userId: String) {
    return this.followService.fetchFollowing({ userId });
  }

  //나를 팔로우한사람 찾기
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Follow])
  async fetchmyFollower(@CurrentUser() currentUser: ICurrentUser) {
    return this.followService.fetchmyFollower({ currentUser });
  }

  //내가 팔로우한사람 찾기
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Follow])
  async fetchmyFollowing(@CurrentUser() currentUser: ICurrentUser) {
    return this.followService.fetchmyFollowing({ currentUser });
  }
}
