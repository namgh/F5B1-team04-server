import { Strategy, Profile } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import * as dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class jwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    //console.log(PassportStrategy(Strategy));

    //console.log('profile1111111', profile);
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      password: profile.id,
    };
  }
}
