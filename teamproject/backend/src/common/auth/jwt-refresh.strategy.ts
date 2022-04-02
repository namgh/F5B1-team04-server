import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookie;
        console.log(cookies);
        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshkey',
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    //console.log('1111111111', req.headers);
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const check = await this.cacheManager.get(`refreshToken:${refreshToken}`);

    if (check)
      throw new UnauthorizedException('이미 로그아웃이 된 상태입니다.');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

// import { Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import {
//   CACHE_MANAGER,
//   Inject,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Cache } from 'cache-manager';

// @Injectable()
// export class jwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//   constructor(
//     @Inject(CACHE_MANAGER)
//     private readonly cacheManager: Cache,
//   ) {
//     super({
//       //jwtFromRequest: (qqq) => { console.log(qqq)  하면 gql-auth.guard.ts 리턴값이 들어옴}
//       jwtFromRequest: (req) => {
//         const cookies = req.headers.cookie;
//         return cookies.replace('refreshToken=', '');
//       },
//       passReqToCallback: true,
//       secretOrKey: 'myRefreshKey',
//     });
//   }

//   async validate(req, payload) {
//     console.log('11111111111');
//     const refreshToken = req.headers.cookie.replace('refreshToken=', '');
//     const check = await this.cacheManager.get(`refreshToken:${refreshToken}`);
//     if (check) throw new UnauthorizedException('이미 로그아웃 되었습니다.');
//     return {
//       id: payload.sub,
//       email: payload.email,
//       role: payload.role,
//     };
//   }
// }
