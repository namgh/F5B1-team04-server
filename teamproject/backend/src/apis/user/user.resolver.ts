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

  @Query(() => [User])
  fetchAllUser() {
    return this.userService.findAll();
  }

  @Query(() => [User])
  fetchUserOrderbyscore() {
    return this.userService.findUserOrderbyscore();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchmyuser(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.fetchmyuser({ currentUser });
  }

  @Query(() => [User])
  fetchUsersearch(@Args('search') search: string) {
    return this.userService.findusersearch({ search });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchmainstack(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.fetchmainstack({ currentUser });
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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@CurrentUser() currentUser: ICurrentUser) {
    return this.userService.delete({ currentUser });
  }

  @Mutation(() => String)
  sendTokenTOSMS(@Args('phonenumber') phonenumber: string) {
    return this.userService.sendTokenTOSMS({ phonenumber });
  }

  @Mutation(() => Boolean)
  async checktoken(
    @Args('token') token: string,
    @Args('phonenumber') phonenumber: string,
  ) {
    return await this.userService.checktoken({ phonenumber, token });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async plususerscore(
    @Args('score') score: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.userService.plususerscore({ score, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async minususerscore(
    @Args('score') score: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.userService.plususerscore({ score, currentUser });
  }

  @Query(() => [User])
  async fetchuserbypage(
    @Args({ name: 'page', nullable: true }) page?: number,
    @Args({ name: 'perpage', nullable: true }) perpage?: number,
  ) {
    return this.userService.fetchuserbypage({ page, perpage });
  }

  @Query(() => Boolean)
  async fetchisnicknameuser(@Args('nickname') nickname: string) {
    return this.userService.fetchisnicknameuser({ nickname });
  }

  @Mutation(() => Boolean)
  async usernulliddelete() {
    return this.userService.usernulliddelete();
  }
}
