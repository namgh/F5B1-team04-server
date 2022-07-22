import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { jwtGoogleStrategy } from 'src/common/auth/jwt-social-google.strategy';
import { jwtNaverStrategy } from 'src/common/auth/jwt-social-naver.strategy';
import { jwtKakaoStrategy } from 'src/common/auth/jwt-social-kakao.strategy';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { MainStack } from '../mainstack/entities/mainstack.entity';
import { CoachProfile } from '../coach/entities/coachprofile.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, MainStack, CoachProfile]),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
    JwtRefreshStrategy,
    jwtGoogleStrategy,
    jwtNaverStrategy,
    jwtKakaoStrategy,
    jwtAccessStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
