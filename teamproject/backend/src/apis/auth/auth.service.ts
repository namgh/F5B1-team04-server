import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  getAccessToken({ user }) {
    console.log(user.id);
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '2h' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshkey', expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken = ${refreshToken};`);
    console.log(res);
  }

  async logout({ accesstoken, refreshToken, currentUser }) {
    const User = {
      accesstoken: accesstoken,
      refreshToken: refreshToken,
      ...currentUser,
    };
    await this.cacheManager.set(`refreshToken:${refreshToken}`, User, {
      ttl: User.exp,
    });
    return await this.cacheManager.set(`accesstoken:${accesstoken}`, User, {
      ttl: User.exp,
    });
  }
}
