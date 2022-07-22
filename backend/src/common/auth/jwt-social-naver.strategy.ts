import { Strategy, Profile } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class jwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['name', '111'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);

    return {
      email: profile.email,
      name: profile.name,
      password: profile.id,
    };
  }
}
