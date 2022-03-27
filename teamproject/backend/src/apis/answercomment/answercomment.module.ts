import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { AnswerLike } from '../answerlike/entities/answerlike.entity';
import { User } from '../user/entities/user.entity';
import { AnswercommentResolver } from './answercomment.resolver';
import { AnswercommentService } from './answercomment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnswerLike, //
      Answer,
      User,
    ]),
  ],
  providers: [AnswercommentResolver, AnswercommentService],
})
export class AnswercommentModule {}
