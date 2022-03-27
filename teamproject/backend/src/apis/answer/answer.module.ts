import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { AnswerResolver } from './answer.resolver';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, User, CoachProfile])],
  providers: [AnswerResolver, AnswerService],
})
export class AnswerModule {}
