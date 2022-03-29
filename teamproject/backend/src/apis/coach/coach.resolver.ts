import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { RolesGuard } from 'src/common/auth/gql-role.guard';
import { Roles } from 'src/common/auth/gql-role.param';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { Role, User } from '../user/entities/user.entity';
import { CoachProfileService } from './coach.service';
import { CreateCoachProfileInput } from './dto/createCoach.input';
import { UpdateCoachInput } from './dto/updateCoach.input';

@Resolver()
export class CoachProfileResolver {
  constructor(private readonly coachProfileService: CoachProfileService) {}

  @Query(() => [User])
  async fetchCoachUserList() {
    return await this.coachProfileService.findAll();
  }

  @Query(() => User)
  async fetchCoachUser(@Args('userId') userId: string) {
    return await this.coachProfileService.findOne({ userId });
  }

  /**
   * 회사메일 검증 로직 추가
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async createCoachProfile(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createProfileInput') createProfileInput: CreateCoachProfileInput,
  ) {
    return await this.coachProfileService.create({
      currentUser,
      createProfileInput,
    });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => User)
  async updateCoachProfile(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('UpdateCoachInput') updateCoachInput: UpdateCoachInput,
  ) {
    return await this.coachProfileService.update({
      currentUser,
      updateCoachInput,
    });
  }

  @Roles(Role.COACH)
  @UseGuards(GqlAuthAccessGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteCoachProfile(@CurrentUser() currentUser: ICurrentUser) {
    return await this.coachProfileService.delete({ currentUser });
  }
}
