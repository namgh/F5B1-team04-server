import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { Question } from '../question/entities/question.entity';
import { User } from '../user/entities/user.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CoachProfile)
    private readonly coachRepository: Repository<CoachProfile>,
  ) {}

  async findAnswerListOrderByHighScoreDesc({ itemCount }) {
    return await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .orderBy('answer.likecount', 'DESC')
      .take(itemCount)
      .getMany();
  }

  async findMyHasAnswerCoaching({ currentUser }) {
    const question = await this.questionRepository.find({
      where: { fromUser: { id: currentUser.id } },
    });
    const QIds = question.map((e) => e.id);
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .where('question.id IN (:id)', { id: QIds })
      .getMany();
    console.log(answered);
    return answered;
  }

  async findAllCoachAnswer({ currentUser }) {
    const question = await this.questionRepository.find({
      where: { toCoach: { id: currentUser.id } },
    });
    const QIds = question.map((e) => e.id);
    const answered = await getRepository(Answer)
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .where('question.id IN (:id)', { id: QIds })
      .getMany();
    // console.log(answered);
    return answered;
  }

  async create({ questionId, createAnswerInput }) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    });

    return await this.answerRepository.save({
      ...createAnswerInput,
      question,
    });
  }

  async update({ answerId, updateAnswerInput }) {
    const prevAnswer = this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['question', 'question.toCoach', 'question.fromUser'],
    });

    return await this.answerRepository.save({
      ...prevAnswer,
      ...updateAnswerInput,
    });
  }

  async delete({ answerId }) {
    const delRes = await this.answerRepository.softDelete({
      id: answerId,
    });
    return delRes.affected ? true : false;
  }
}
