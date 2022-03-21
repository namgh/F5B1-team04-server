import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  findAllUser() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phonenumber') phonenumber: string,
    @Args('nickname') nickname: string,
    @Args('name') name: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userService.create({
      email,
      hashedPassword,
      phonenumber,
      name,
      nickname,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('password') password: string,
    @Args('phonenumber') phonenumber: string,
    @Args('nickname') nickname: string,
    @Args('name') name: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.updateUser({
      hashedPassword,
      phonenumber,
      name,
      nickname,
      currentUser,
    });
  }

  @UseGuards(GqlAuthAccessGuard) //gql사용할때
  @Mutation(() => Boolean)
  deleteUser(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.delete({ currentUser });
  }
}
