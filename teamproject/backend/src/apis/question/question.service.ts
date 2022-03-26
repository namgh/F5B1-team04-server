import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { User } from '../user/entities/user.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CoachProfile)
    private readonly coachReposotory: Repository<CoachProfile>,
  ) {}

  /**
   * (my)user가 한 질문 (+ 갯수)
   * (my)user의 질문에 답변이 있는것들 (+ 갯수)
   * (my)user의 질문에 답변이 없는것들 (+ 갯수)
   *
   * coach에게 달린 질문 (+ 갯수)
   * 답변이 달린 질문 (+ 갯수)
   * 답변이 없는 질문 (+ 갯수)
   *
   * cud
   */

  async findAllCoachQuestion({ coachId }) {
    return await this.questionRepository.find({
      where: { toCoach: coachId },
      relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    });
  }

  async findAllHasAnswerQuestion({ coachId }) {}

  async findAllHasNoAnsweredQuestion({ coachId }) {}

  async findAllMyQuestion({ currentUser }) {
    return await this.questionRepository.find({
      where: { fromUser: currentUser.id },
      relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    });
  }

  async findMyHasAnswerQuestion({ currentUser }) {}

  async findMyHasNoAnswerQuestion({ currentUser }) {}

  async findQuestion({ questionId }) {
    // // method-1 : @Query(() => Question)
    // const question = await this.questionRepository.findOne({
    //   where: { id: questionId },
    //   relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    // });
    //method-2 : @Query(() => [Question])
    return await getRepository(Question)
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.fromUser', 'user')
      .leftJoinAndSelect('question.toCoach', 'coach')
      .leftJoinAndSelect('coach.coachProfile', 'profile')
      .where('question.id=:id', { id: questionId })
      .getOne();
  }

  async create({ coachId, currentUser, createQuestionInput }) {
    const fromUser = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['coachProfile'],
    });

    const toCoach = await this.userRepository.findOne({
      where: { id: coachId },
      relations: ['coachProfile'],
    });

    return await this.questionRepository.save({
      fromUser,
      toCoach,
      ...createQuestionInput,
    });
  }

  async update({ questionId, updateQuestionInput }) {
    const question_ = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['fromUser', 'toCoach'],
    });
    if (!question_) {
      return new UnprocessableEntityException();
    }
    const q = await this.questionRepository.save({
      ...question_,
      ...updateQuestionInput,
    });
    console.log(updateQuestionInput);
    console.log(question_);
    console.log(q);
    return q;
  }

  async delete({ questionId }) {
    const resDelQuestion = await this.questionRepository.softDelete({
      id: questionId,
    });

    return resDelQuestion.affected ? true : false;
  }
}
