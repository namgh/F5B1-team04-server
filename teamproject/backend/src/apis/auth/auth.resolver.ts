import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import * as jwt from 'jsonwebtoken';
import { access } from 'fs';
import { Token } from 'graphql';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await this.userService.findemail({ email });
    if (!user)
      throw new UnprocessableEntityException('email이 존재하지 않습니다.');

    const isAuthenticated = await bcrypt.compare(password, user.password); //user.password - 해쉬된 비밀번호
    if (!isAuthenticated)
      throw new UnauthorizedException('비밀번호가 틀렸습니다!!!');
    await this.authService.setRefreshToken({ user, res: context.res });

    return await this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async resotreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }

  @UseGuards(GqlAuthAccessGuard) // 로그인 한 사람만 이 API에 접근가능함
  @Mutation(() => String)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    console.log('++++++++++++', context.req.headers.cookie);
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    // console.log('+++++++++++', context.req.headers);
    const accesstoken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );

    try {
      jwt.verify(refreshToken, 'myRefreshkey');
      jwt.verify(accesstoken, 'myAccessKey');
    } catch {
      throw new UnauthorizedException('토큰검증 실패');
    }

    //console.log(context.req.refreshToken);
    await this.authService.logout({ refreshToken, currentUser, accesstoken });

    return '성공';
  }
}
