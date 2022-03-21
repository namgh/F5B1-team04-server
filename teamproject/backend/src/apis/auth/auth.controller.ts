import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: Pick<User, 'email' | 'password' | 'name'>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async loginfunction(res, req) {
    let user = await this.userService.findemail({ email: req.user.email });
    // 2. 회원가입
    if (!user) {
      const { password, ...rest } = req.user;
      const createUser = { ...rest, password };
      user = await this.userService.socailcreate({ ...createUser });
    }
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoole(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    
    const user = this.loginfunction(res, req);
    this.authService.setRefreshToken({ user, res });

    res.redirect(
      'http://localhost:5500/homework/main-project/frontend/login/index.html',
    );
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
     const user = this.loginfunction(res, req);
    this.authService.setRefreshToken({ user, res });

    res.redirect(
      'http://localhost:5500/homework/main-project/frontend/login/index.html',
    );
  }
}
