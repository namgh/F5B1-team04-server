import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { CoachProfileResolver } from './coach.resolver';
import { CoachProfileService } from './coach.service';
import { CoachProfile } from './entities/coachprofile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoachProfile, //
      User,
    ]),
  ],
  providers: [
    CoachProfileResolver, //
    CoachProfileService,
  ],
})
export class CoachModule {}
