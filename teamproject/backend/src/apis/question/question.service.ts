import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { CoachProfile } from '../coach/entities/coachprofile.entity';
import { Deposit, DEPOSIT_STATUS } from '../deposit/entities/deposit.entity';
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

    private readonly connection: Connection,
  ) {}

  async findAllCoachQuestion({ coachId }) {
    return await this.questionRepository.find({
      where: { toCoach: { id: coachId } },
      relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    });
  }
  async findAllHasNoAnsweredQuestion({ coachId }) {}

  async findAllMyQuestion({ currentUser }) {
    return await this.questionRepository.find({
      where: { fromUser: currentUser.id },
      relations: ['fromUser', 'toCoach', 'toCoach.coachProfile'],
    });
  }
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
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    /**
     * fromUser
     * toCoach
     *
     * 1. 코치가 설정해 둔 초기 비용 -> coachUser : amount
     * 2. User - initAmount
     * 3. Deposit create
     * 4. question save
     */

    try {
      const fromUser = await queryRunner.manager.findOne(User, {
        where: { id: currentUser.id },
        relations: ['coachProfile'],
      });
      const toCoach = await queryRunner.manager.findOne(User, {
        where: { id: coachId },
        relations: ['coachProfile'],
      });

      const amount = toCoach.coachProfile.answerInitAmount;
      if (fromUser.point - toCoach.coachProfile.answerInitAmount) {
        throw new UnprocessableEntityException(
          '포인트 잔액이 충분하지 않습니다.',
        );
      }

      const minusUser = await queryRunner.manager.save({
        ...fromUser,
        point: fromUser.point - toCoach.coachProfile.answerInitAmount,
      });

      const deposit = await queryRunner.manager.save(Deposit, {
        fromUser: minusUser,
        toCoach,
        fromAmount: toCoach.coachProfile.answerInitAmount,
        status: DEPOSIT_STATUS.PENDING,
      });
      console.log('💛Deposit', deposit);

      const question = await queryRunner.manager.save(Question, {
        ...createQuestionInput,
        fromUser: minusUser,
        toCoach,
        depositId: deposit.id,
      });
      await queryRunner.commitTransaction();

      return question;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
