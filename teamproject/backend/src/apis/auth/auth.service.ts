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
      { email: user.email, sub: user.id, role: user.role },
      { secret: 'myAccessKey', expiresIn: '2h' },
    );
  }

  async setRefreshToken({ user, res }) {
    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { secret: 'myRefreshkey', expiresIn: '2w' },
    );
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
      'Set-Cookie',
      `refreshToken${refreshToken}; path=/; domain =.namgh627.shop; SameSite = None; Secure=false; httpOnly;`,
    );
  }

  async logout({ refreshToken, currentUser }) {
    const User = {
      refreshToken: refreshToken,
      ...currentUser,
    };
    return await this.cacheManager.set(`refreshToken:${refreshToken}`, User, {
      ttl: User.exp,
    });
  }
}
