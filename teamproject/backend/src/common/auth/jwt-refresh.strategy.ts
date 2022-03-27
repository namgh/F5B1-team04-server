import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class jwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //jwtFromRequest: (qqq) => { console.log(qqq)  하면 gql-auth.guard.ts 리턴값이 들어옴}
      jwtFromRequest: (req) => {
        console.log(req.headers);
        const cookies = req.headers.cookie;
        return cookies.replace('refreshToken=', '');
      },
      passReqToCallback: true,
      secretOrKey: 'myRefreshKey',
    });
  }

  async validate(req, payload) {
    console.log(req.headers);
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const check = await this.cacheManager.get(`refreshToken:${refreshToken}`);
    if (check) throw new UnauthorizedException('이미 로그아웃 되었습니다.');
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
