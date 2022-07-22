import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { AuthModule } from '../auth/auth.module';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { MainStack } from '../mainstack/entities/mainstack.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, MainStack, CoachProfile])],
  providers: [
    UserService,
    UserResolver, //
    jwtAccessStrategy,
    AuthModule,
  ],
})
export class UserModule {}
