import { Strategy, ExtractJwt } from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class jwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accesstoken = req.headers.authorization.replace('Bearer ', '');
    const check = await this.cacheManager.get(`accesstoken:${accesstoken}`);
    if (check) throw new UnauthorizedException('이미 로그아웃 되었습니다.');
    console.log('aaaaaaaaaa');
    return {
      id: payload.sub,
      email: payload.email,
      exp: payload.exp,
    };
  }
}
