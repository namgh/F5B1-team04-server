import { Strategy, Profile } from 'passport-kakao';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class jwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
      scope: ['profile_nickname', 'profile_image'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('profile1111111', profile._json.kakao_account.email);

    return {
      email: profile._json.kakao_account.email + '.kakao',
      name: profile.displayName,
      password: profile.id,
    };
  }
}
