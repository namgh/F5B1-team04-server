import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { User } from '../user/entities/user.entity';
import { AnswerlikeResolver } from './answerlike.resolver';
import { AnswerlikeService } from './answerlike.service';
import { AnswerLike } from './entities/answerlike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerLike, Answer, User])],
  providers: [AnswerlikeResolver, AnswerlikeService],
})
export class AnswerlikeModule {}
