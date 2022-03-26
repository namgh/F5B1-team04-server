import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question, //
      User,
      CoachProfile,
    ]),
  ],
  providers: [QuestionResolver, QuestionService],
})
export class QuestionModule {}
