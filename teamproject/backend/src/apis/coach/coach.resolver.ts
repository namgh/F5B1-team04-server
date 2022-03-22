import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../user/entities/user.entity';
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

  @Mutation(() => User)
  async createCoachProfile(
    @Args('userId') userId: string,
    @Args('createProfileInput') createProfileInput: CreateCoachProfileInput,
  ) {
    return await this.coachProfileService.create({
      userId,
      createProfileInput,
    });
  }

  @Mutation(() => User)
  async updateCoachProfile(
    @Args('userId') userId: string,
    @Args('UpdateCoachInput') updateCoachInput: UpdateCoachInput,
  ) {
    return await this.coachProfileService.update({ userId, updateCoachInput });
  }

  @Mutation(() => Boolean)
  async deleteCoachProfile(@Args('userId') userId: string) {
    return await this.coachProfileService.delete({ userId });
  }
}
