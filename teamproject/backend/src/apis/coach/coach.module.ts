import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogTag } from '../blogtag/entities/blogtag.entity';
import { CoachTag } from '../coachtag/coachtag.entities/coachtag.entity';
//import { CoachTag } from '../coachtag/entities/coachtag.entity';
import { User } from '../user/entities/user.entity';
import { CoachProfileResolver } from './coach.resolver';
import { CoachProfileService } from './coach.service';
import { CoachProfile } from './entities/coachprofile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoachProfile, //
      User,
      BlogTag,
      CoachTag,
    ]),
  ],
  providers: [
    CoachProfileResolver, //
    CoachProfileService,
  ],
})
export class CoachModule {}
