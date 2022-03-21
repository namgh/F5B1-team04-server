import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { jwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { jwtGoogleStrategy } from 'src/common/auth/jwt-social-google.strategy';
import { jwtNaverStrategy } from 'src/common/auth/jwt-social-naver.strategy';
import { jwtKakaoStrategy } from 'src/common/auth/jwt-social-kakao.strategy';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
    AuthModule,
    jwtRefreshStrategy,
    jwtGoogleStrategy,
    jwtNaverStrategy,
    jwtKakaoStrategy,
    jwtAccessStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}